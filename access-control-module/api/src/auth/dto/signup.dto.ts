import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsEmail,
	IsPhoneNumber,
	Length,
	Matches,
} from 'class-validator';

export class SignUpDto {
	@ApiProperty({
		description: 'User full name',
		example: 'John Doe',
	})
	@IsString()
	@Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
	name: string;

	@ApiProperty({
		description: 'User email address',
		example: 'johndoe@example.com',
	})
	@IsEmail({}, { message: 'Email must be a valid email address.' })
	email: string;

	@ApiProperty({
		description: 'User phone number in a valid international format',
		example: '+254712345678',
	})
	@IsPhoneNumber('KE', {
		message: 'Phone number must be valid and in international format.',
	})
	phoneNumber: string;

	@ApiProperty({
		description: 'Residential address of the user',
		example: '1234 Elm Street, Nairobi, Kenya',
	})
	@IsString()
	@Length(5, 100, {
		message: 'Address must be between 5 and 100 characters.',
	})
	address: string;

	@ApiProperty({
		description: 'Kenya Revenue Authority PIN number',
		example: 'A123456789B',
	})
	@IsString()
	@Length(10, 12, {
		message: 'KRA PIN number must be between 10 and 12 characters.',
	})
	kraPinNumber: string;

	@ApiProperty({
		description:
			'Password with minimum 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
		example: 'StrongPassword@123',
	})
	@IsString()
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
		},
	)
	password: string;
}
