import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorators';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user')
@ApiTags('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'user', action: 'READ' })
	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard)
	@Get('me')
	profile(@Req() req: any) {
		return this.userService.profile(req.user.id);
	}

	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'user', action: 'DELETE' })
	@Delete(':userId/delete')
	delete(@Param('userId') userId: string) {
		return this.userService.delete(userId);
	}

	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'user', action: 'UPDATE' })
	@Post(':userId/update-role')
	updateRole(
		@Param('userId') userId: string,
		@Body() updateUserRoleDto: UpdateUserRoleDto,
	) {
		return this.userService.updateRole(updateUserRoleDto, userId);
	}
}
