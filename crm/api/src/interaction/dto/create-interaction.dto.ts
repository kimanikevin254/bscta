import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InteractionType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateInteractionDto {
	@ApiProperty({
		description: 'The ID of the lead associated with this interaction',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	leadId?: string;

	@ApiProperty({
		description: 'The ID of the customer associated with this interaction',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	customerId?: string;

	@ApiProperty({
		description: 'The type of interaction',
		enum: InteractionType,
		required: true,
	})
	@IsEnum(InteractionType)
	interactionType: InteractionType;

	@ApiProperty({
		description: 'The date of the interaction',
		type: String,
		format: 'date-time',
		required: true,
	})
	@IsDate()
	@Type(() => Date)
	date: Date;

	@ApiProperty({
		description: 'Notes related to the interaction',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	notes?: string;
}
