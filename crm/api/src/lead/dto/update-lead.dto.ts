import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLeadDto } from './create-lead.dto';
import { LeadStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
	@ApiProperty({
		description: 'The status of the lead',
		enum: LeadStatus,
		example: LeadStatus.NEW,
	})
	@IsEnum(LeadStatus)
	status: LeadStatus;
}
