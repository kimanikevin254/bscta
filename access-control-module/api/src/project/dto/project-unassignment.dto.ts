import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ProjectUnassignmentDto {
	@ApiProperty({
		description: 'The ID of the user to unassign the project',
		example: 'a8a0a7c4-b8d2-4d92-8c3f-72a834b6572f',
	})
	@IsString()
	@IsUUID()
	userId: string;
}
