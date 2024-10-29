import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteUserDto {
	@ApiProperty({
		description: 'Unique identifier of the user to be deleted',
		example: 'd1b2c3f4-5678-1234-9012-abcdefabcdef',
	})
	@IsUUID()
	userId: string;
}
