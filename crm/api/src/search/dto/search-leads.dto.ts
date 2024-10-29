import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '@prisma/client';

export class SearchLeadsDto {
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
			'Status of the lead, which could be NEW, IN_PROGRESS, CONVERTED, or CLOSED.',
		enum: LeadStatus,
		example: LeadStatus.NEW,
		required: false,
	})
	@IsOptional()
	@IsEnum(LeadStatus)
	status?: LeadStatus;
}
