import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class CreateProjectDto {
	@ApiProperty({
		description: 'The name of the project.',
		example: 'AI Development Project',
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'A brief description of the project.',
		example:
			'This project is focused on developing AI-based solutions for data analysis.',
	})
	@IsString()
	@IsNotEmpty()
	description: string;

	@ApiProperty({
		description: 'The start date of the project.',
		example: '2023-01-01T00:00:00Z',
	})
	@IsDate()
	@IsNotEmpty()
	@Type(() => Date)
	startDate: Date;

	@ApiProperty({
		description: 'The end date of the project.',
		example: '2023-12-31T23:59:59Z',
	})
	@IsDate()
	@IsOptional()
	@Type(() => Date)
	endDate?: Date;
}
