import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/services/prisma.service';
import { UserRole } from './interfaces/role.interface';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class UserService {
	constructor(
		private prismaService: PrismaService,
		private mailService: MailService,
	) {}

	private formatUserRoleAndPermissions = (role: UserRole) => {
		const permissionsMap: { [resource: string]: string[] } = {};

		// Loop through each permission and add actions to the respective resource
		role.permissions.forEach((permission) => {
			if (!permissionsMap[permission.resource]) {
				permissionsMap[permission.resource] = []; // Initialize if not exists
			}
			permissionsMap[permission.resource].push(permission.action);
		});

		// Convert the permissionsMap back to the desired format
		const permissions = Object.entries(permissionsMap).map(
			([resource, actions]) => ({
				resource,
				actions,
			}),
		);

		return {
			name: role.name,
			permissions,
		};
	};

	async create(data: Prisma.UserCreateInput) {
		try {
			return await this.prismaService.user.create({
				data: {
					...data,
				},
			});
		} catch (error) {
			// Check if the error is a Prisma Client Known Request Error
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					// Unique constraint violation code
					throw new HttpException(
						'This email is already registered. Please log in',
						HttpStatus.BAD_REQUEST,
					);
				}
			}

			// For other errors, rethrow them
			throw new HttpException(
				'An error occured while creating the user',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findOne(data: Prisma.UserWhereUniqueInput) {
		return await this.prismaService.user.findUnique({
			where: { ...data },
		});
	}

	async updateOne(
		where: Prisma.UserWhereUniqueInput,
		data: Prisma.UserUpdateInput,
	) {
		try {
			return this.prismaService.user.update({ where, data });
		} catch (error) {
			// Check if the error is a Prisma Client Known Request Error
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					// User not found
					throw new HttpException(
						'User not found',
						HttpStatus.BAD_REQUEST,
					);
				}
			}

			// For other errors, throw a generic 500
			throw new HttpException(
				'An error occured while creating the user',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getUserRole(userId: string) {
		const user = await this.prismaService.user.findUniqueOrThrow({
			where: { id: userId },
			select: {
				role: {
					select: {
						name: true,
						permissions: {
							select: {
								resource: true,
								action: true,
							},
						},
					},
				},
			},
		});

		// Transform user role
		const role = this.formatUserRoleAndPermissions(user.role);

		return role;
	}

	async findAll() {
		return this.prismaService.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				phoneNumber: true,
				address: true,
				kraPinNumber: true,
				role: {
					select: {
						name: true,
					},
				},
			},
		});
	}

	async profile(userId: string) {
		return this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				name: true,
				email: true,
				phoneNumber: true,
				address: true,
				kraPinNumber: true,
				role: {
					select: {
						name: true,
					},
				},
			},
		});
	}

	async delete(userId: string) {
		try {
			// Make sure user exists
			const user = await this.findOne({ id: userId });

			if (!user) {
				throw new Error('User not found');
			}

			// Delete user
			await this.prismaService.user.delete({
				where: { id: user.id },
			});

			return {
				message: 'User deleted successfully',
			};
		} catch (error) {
			if (error.message === 'User not found') {
				throw new HttpException(
					'Invalid user ID',
					HttpStatus.NOT_FOUND,
				);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async updateRole(updateUserRoleDto: UpdateUserRoleDto, userId: string) {
		try {
			const user = await this.findOne({ id: userId });

			if (!user) {
				throw new Error('User not found');
			}

			// Make sure user does not have the submitted role
			const userRole = await this.getUserRole(user.id);

			if (userRole.name === updateUserRoleDto.role) {
				throw new Error('User already has role');
			}

			// Update the user's role
			const role = await this.prismaService.role.findUnique({
				where: { name: updateUserRoleDto.role },
			});

			await this.updateOne(
				{ id: user.id },
				{ role: { connect: { id: role.id } } },
			);

			// Send email to user whose role has been updated
			await this.mailService.sendRoleUpdateMail(
				user.email,
				user.name,
				role.name,
			);
		} catch (error) {
			if (error.message === 'User not found') {
				throw new HttpException(
					'Invalid user ID',
					HttpStatus.NOT_FOUND,
				);
			} else if (error.message === 'User already has role') {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}
}
