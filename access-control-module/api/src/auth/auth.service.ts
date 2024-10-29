import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from 'src/services/mail.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LogInDto } from './dto/login.dto';
import { LogOutDto } from './dto/logOut.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserInviteDto } from './dto/invite-user.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { FormattedRole } from 'src/user/interfaces/role.interface';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private prismaService: PrismaService,
		private mailService: MailService,
	) {}

	private async hashPassword(password: string) {
		const saltOrRounds = 10;
		return await bcrypt.hash(password, saltOrRounds);
	}

	private async generateTokens(userId: string, role: FormattedRole) {
		try {
			const accessToken = await this.jwtService.signAsync(
				{ sub: userId, role },
				{ expiresIn: '1h' },
			);

			const refreshToken = randomBytes(32).toString('hex');

			// Save the refresh token to db
			await this.prismaService.refreshToken.create({
				data: {
					token: refreshToken,
					userId,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				},
			});

			return { accessToken, refreshToken };
		} catch (error) {
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	private generateInviteToken() {
		return randomBytes(32).toString('hex');
	}

	async inviteUser(userInviteDto: UserInviteDto, userId: string) {
		try {
			// Make sure user does not exist
			const user = await this.userService.findOne({
				email: userInviteDto.email,
			});

			if (user) {
				throw new Error('User already exists');
			}

			// Retrieve role
			const role = await this.prismaService.role.findFirst({
				where: { name: userInviteDto.role },
			});

			// Generate invite token
			const token = this.generateInviteToken();

			// Save the invite
			const invite = await this.prismaService.invite.create({
				data: {
					name: userInviteDto.name,
					email: userInviteDto.email,
					phoneNumber: userInviteDto.phoneNumber,
					role: {
						connect: { id: role.id },
					},
					invitedBy: {
						connect: { id: userId },
					},
					token,
				},
			});

			// Send an invitation email to invited user
			await this.mailService.sendUserInviteMail(
				invite.email,
				invite.name,
				`http://localhost:3001/auth/accept-invite?token=${token}`,
				role.name,
			);

			return {
				message: `User has been invited successfully`,
				user: { name: invite.name, email: invite.email },
			};
		} catch (error) {
			if (error.message === 'User already exists') {
				throw new HttpException(
					'User already exists',
					HttpStatus.BAD_REQUEST,
				);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async acceptInvite(acceptInviteDto: AcceptInviteDto) {
		try {
			// Make sure invite exists
			const invite = await this.prismaService.invite.findFirst({
				where: { token: acceptInviteDto.token, status: 'PENDING' },
			});

			if (!invite) {
				throw new Error('Invalid invite link');
			}

			// Create user
			const user = await this.prismaService.user.create({
				data: {
					name: invite.name,
					email: invite.email,
					phoneNumber: invite.phoneNumber,
					address: acceptInviteDto.address,
					kraPinNumber: acceptInviteDto.kraPinNumber,
					passwordHash: await this.hashPassword(
						acceptInviteDto.password,
					),
					emailVerifiedAt: new Date(),
					roleId: invite.roleId,
				},
			});

			// Mark invite as accepted
			await this.prismaService.invite.update({
				where: { id: invite.id },
				data: { status: 'ACCEPTED' },
			});

			// Get user role
			const role = await this.userService.getUserRole(user.id);

			// Generate tokens to automatically log in the user
			const tokens = await this.generateTokens(user.id, role);

			return {
				tokens,
				userId: user.id,
			};
		} catch (error) {
			if (error.message === 'Invalid invite link') {
				throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async login(logInDto: LogInDto) {
		try {
			// Retrieve user
			const user = await this.userService.findOne({
				email: logInDto.email,
			});

			if (!user) {
				throw new HttpException('No User found', HttpStatus.NOT_FOUND);
			}

			// Check if password matches
			const passwordMatches = await bcrypt.compare(
				logInDto.password,
				user.passwordHash,
			);

			if (!passwordMatches) {
				throw new Error('Passwords do not match');
			}

			// Get user role
			const role = await this.userService.getUserRole(user.id);

			// Generate tokens
			const tokens = await this.generateTokens(user.id, role);

			return {
				tokens,
				userId: user.id,
			};
		} catch (error) {
			if (
				error.message === 'Passwords do not match' ||
				error.message === 'No User found'
			) {
				throw new HttpException(
					'Incorrect credentials',
					HttpStatus.UNAUTHORIZED,
				);
			}

			// Throw a 500 for any other error
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async refreshTokens(refreshTokensDto: RefreshTokensDto) {
		try {
			// Check if refresh token exists
			const refreshToken =
				await this.prismaService.refreshToken.findFirstOrThrow({
					where: {
						token: refreshTokensDto.refreshToken,
						userId: refreshTokensDto.userId,
						expiresAt: {
							gte: new Date(), // Check that expiresAt is greater than or equal to the current date
						},
					},
				});

			// Mark old refresh token as expired
			await this.prismaService.refreshToken.update({
				where: {
					id: refreshToken.id,
				},
				data: {
					expiresAt: new Date(),
				},
			});

			// Get user role
			const role = await this.userService.getUserRole(
				refreshTokensDto.userId,
			);

			// Generate tokens
			const tokens = await this.generateTokens(
				refreshTokensDto.userId,
				role,
			);

			return {
				tokens,
				userId: refreshTokensDto.userId,
			};
		} catch (error) {
			console.log(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					// Refresh token not found
					throw new HttpException(
						'Unauthorized',
						HttpStatus.UNAUTHORIZED,
					);
				}
			}

			// For any other errors, throw a generic 500
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async logOut(logOutDto: LogOutDto, userId: string) {
		try {
			await this.prismaService.refreshToken.update({
				where: {
					token: logOutDto.refreshToken,
					userId,
				},
				data: {
					expiresAt: new Date(),
				},
			});
		} catch (error) {
			console.log(error.message); // No need to return any data to user here
		}
	}

	async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
		try {
			const user = await this.userService.findOne({ id: userId });

			// Check if user password is same as provided old password
			const passwordMatches = await bcrypt.compare(
				changePasswordDto.oldPassword,
				user.passwordHash,
			);

			if (!passwordMatches) {
				throw new Error('Passwords do not match');
			}

			const passwordHash = await this.hashPassword(
				changePasswordDto.newPassword,
			);

			// Update user password
			await this.userService.updateOne({ id: userId }, { passwordHash });

			return {
				message: 'Password updated successfully',
			};
		} catch (error) {
			if (error.message === 'Passwords do not match') {
				throw new HttpException(
					'Incorrect credentials',
					HttpStatus.BAD_REQUEST,
				);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
		try {
			// Make sure user exists
			const user = await this.userService.findOne({
				email: forgetPasswordDto.email,
			});

			if (user) {
				// Generate a password rest token
				const passwordResetToken = randomBytes(32).toString('hex');

				// Save the password reset token to db
				await this.prismaService.passwordResetToken.create({
					data: {
						token: passwordResetToken,
						userId: user.id,
						expiresAt: new Date(Date.now() + 10 * 60 * 1000),
					},
				});

				// Send email
				await this.mailService.sendPasswordResetMail(
					forgetPasswordDto.email,
					user.name,
					`http://localhost:3000/auth/reset-password?token=${passwordResetToken}`,
				);
			}

			return {
				message:
					'If this email address is registered, you will receive a password reset link.',
			};
		} catch (error) {
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		try {
			// Check if token exists
			const passwordResetToken =
				await this.prismaService.passwordResetToken.findFirst({
					where: {
						token: resetPasswordDto.token,
						expiresAt: {
							gte: new Date(),
						},
					},
					include: {
						user: {
							select: {
								id: true,
							},
						},
					},
				});

			if (!passwordResetToken) {
				throw new Error('Invalid token');
			}

			// Reset user's password
			const hashedPassword = await this.hashPassword(
				resetPasswordDto.password,
			);

			await this.userService.updateOne(
				{ id: passwordResetToken.user.id },
				{ passwordHash: hashedPassword },
			);

			// Invalidate the token
			await this.prismaService.passwordResetToken.update({
				where: { id: passwordResetToken.id },
				data: { expiresAt: new Date() },
			});

			return {
				message:
					'Password reset successfully. You can now log in with your new credentials',
			};
		} catch (error) {
			if (error.message === 'Invalid token') {
				throw new HttpException(
					'Invalid token',
					HttpStatus.BAD_REQUEST,
				);
			}

			// Generic 500 for other errors
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
