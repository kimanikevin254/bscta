import { ApiProperty } from '@nestjs/swagger';
import { RolesNames } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
	@ApiProperty({
		description: 'Role assigned to the invited user',
		example: 'PROJECT_MANAGER',
		enum: RolesNames,
	})
	@IsEnum(RolesNames, {
		message: 'Role must be one of: ADMIN, PROJECT_MANAGER, ENGINEER',
	})
	role: RolesNames;
}
