import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ProjectAssignmentDto {
	@ApiProperty({
		description: 'The email of the user to assign to the project',
		example: 'a8a0a7c4-b8d2-4d92-8c3f-72a834b6572f',
	})
	@IsEmail()
	email: string;
}
