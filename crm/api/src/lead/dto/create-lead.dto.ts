import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
	@ApiProperty({
		description: 'The name of the lead',
		type: String,
		example: 'John Doe',
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: 'The email address of the lead (must be unique)',
		type: String,
		example: 'johndoe@example.com',
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: 'The phone number of the lead',
		type: String,
		example: '+1234567890',
	})
	@IsString()
	phone: string;

	@ApiProperty({
		description: 'The company name of the lead (optional)',
		type: String,
		example: 'Acme Corp',
		required: false,
	})
	@IsOptional()
	@IsString()
	companyName?: string;
}
