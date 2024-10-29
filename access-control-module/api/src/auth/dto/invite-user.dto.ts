import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsPhoneNumber,
	Length,
	IsEnum,
} from 'class-validator';
import { RolesNames } from '@prisma/client';

export class UserInviteDto {
	@ApiProperty({
		description: 'Full name of the user being invited',
		example: 'Jane Smith',
	})
	@IsString()
	@Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
	name: string;

	@ApiProperty({
		description: 'Email address of the user being invited',
		example: 'janesmith@example.com',
	})
	@IsEmail({}, { message: 'Email must be a valid email address.' })
	email: string;

	@ApiProperty({
		description:
			'Phone number of the user being invited, in international format',
		example: '+254712345678',
	})
	@IsPhoneNumber('KE', {
		message: 'Phone number must be valid and in international format.',
	})
	phoneNumber: string;

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
