import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LogInDto } from './dto/login.dto';
import { LogOutDto } from './dto/logOut.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserInviteDto } from './dto/invite-user.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { AuthorizationGuard } from './guards/authorization.guard';
import { Permissions } from './decorators/permissions.decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'user', action: 'CREATE' })
	@Post('invite-user')
	inviteUser(@Body() userInviteDto: UserInviteDto, @Req() req: any) {
		return this.authService.inviteUser(userInviteDto, req.user.id);
	}

	@Post('accept-invite')
	acceptInvite(@Body() acceptInviteDto: AcceptInviteDto) {
		return this.authService.acceptInvite(acceptInviteDto);
	}

	@Post('login')
	login(@Body() logInDto: LogInDto) {
		return this.authService.login(logInDto);
	}

	@Post('refresh-token')
	refreshTokens(@Body() refreshTokensDto: RefreshTokensDto) {
		return this.authService.refreshTokens(refreshTokensDto);
	}

	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard)
	@Post('logout')
	logout(@Body() logOutDto: LogOutDto, @Req() req: any) {
		return this.authService.logOut(logOutDto, req.user.id);
	}

	@UseGuards(AuthenticationGuard)
	@ApiBearerAuth()
	@Post('change-password')
	changePassword(
		@Body() changePasswordDto: ChangePasswordDto,
		@Req() req: any,
	) {
		return this.authService.changePassword(changePasswordDto, req.user.id);
	}

	@Post('forget-password')
	forgetPasswordPassword(
		@Body() forgetPasswordPasswordDto: ForgetPasswordDto,
	) {
		return this.authService.forgetPassword(forgetPasswordPasswordDto);
	}

	@Post('reset-password')
	resetPasswordPassword(@Body() resetPasswordPasswordDto: ResetPasswordDto) {
		return this.authService.resetPassword(resetPasswordPasswordDto);
	}
}
