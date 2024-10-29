import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerStatus } from '@prisma/client';

export class SearchCustomersDto {
	@ApiProperty({
		description:
			'Name of the lead to search for. Partial matches are supported.',
		example: 'John Doe',
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		description:
			'Email of the lead to search for. Partial matches are supported.',
		example: 'john.doe@example.com',
		required: false,
	})
	@IsOptional()
	@IsString()
	email?: string;

	@ApiProperty({
		description:
			'Status of the lead, which could be NEW, IN_PROGRESS, or CLOSED.',
		enum: CustomerStatus,
		example: CustomerStatus.ACTIVE,
		required: false,
	})
	@IsOptional()
	@IsEnum(CustomerStatus)
	status?: CustomerStatus;
}
