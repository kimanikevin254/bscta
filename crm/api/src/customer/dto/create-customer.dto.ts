import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
	@ApiProperty({
		description:
			'The unique identifier of the lead being converted to a customer.',
		type: String,
		format: 'uuid',
		example: 'c0a801eb-0b95-4b6b-8b0c-0da8a85be839',
	})
	@IsNotEmpty({ message: 'Lead ID is required' })
	@IsUUID('all', { message: 'Lead ID must be a valid UUID' })
	leadId: string;

	@ApiProperty({
		description: 'Notes associated with this conversion.',
		type: String,
		example: 'This is an example note',
	})
	@IsOptional()
	notes: string;
}
