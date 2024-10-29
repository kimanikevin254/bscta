import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConversionType } from '@prisma/client';

export class CreateConversionHistoryDto {
	@ApiProperty({
		description:
			'The ID of the lead associated with this conversion history',
		required: true,
		type: String,
	})
	@IsString()
	leadId: string;

	@ApiProperty({
		description:
			'The ID of the customer associated with this conversion history',
		required: true,
		type: String,
	})
	@IsString()
	customerId: string;

	@ApiProperty({
		description: 'The date when the conversion occurred',
		type: String,
		format: 'date-time',
		required: true,
	})
	@IsDate()
	conversionDate: Date;

	@ApiProperty({
		description: 'Notes related to the conversion',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	notes?: string;

	@ApiProperty({
		description: 'The ID of the user who converted the lead',
		required: true,
		type: String,
	})
	@IsString()
	convertedById: string;

	@ApiProperty({
		description: 'The type of conversion',
		enum: ConversionType,
		required: true,
	})
	@IsEnum(ConversionType)
	conversionType: ConversionType;
}
