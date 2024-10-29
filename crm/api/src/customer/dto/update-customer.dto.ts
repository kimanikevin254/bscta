import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerStatus } from '@prisma/client';

export class UpdateCustomerDto {
	@ApiProperty({
		description: 'The name of the customer',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		description: 'The email of the customer',
		required: false,
		type: String,
	})
	@IsEmail()
	@IsOptional()
	email?: string;

	@ApiProperty({
		description: 'The phone number of the customer',
		required: false,
		type: String,
	})
	@IsOptional()
	phone?: string;

	@ApiProperty({
		description: 'The company name of the customer',
		required: false,
		type: String,
	})
	@IsString()
	@IsOptional()
	companyName?: string;

	@ApiProperty({
		description: 'The status of the customer',
		enum: CustomerStatus,
		required: false,
	})
	@IsEnum(CustomerStatus)
	@IsOptional()
	status?: CustomerStatus;
}
