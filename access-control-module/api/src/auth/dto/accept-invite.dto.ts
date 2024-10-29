import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
	@ApiProperty({
		description: 'The invite token from the received email.',
		example: 'hduehd3ey387ey873',
	})
	@IsString()
	@IsNotEmpty({ message: 'inviteToken is required.' })
	token: string;

	@ApiProperty({
		description:
			'The password chosen by the user. Must meet complexity requirements: at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
		example: 'P@ssw0rd123',
	})
	@IsString()
	@IsNotEmpty({ message: 'Password is required.' })
	@Matches(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		{
			message:
				'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
		},
	)
	password: string;

	@ApiProperty({
		description: "The user's physical address.",
		example: '123 Main St, Nairobi, Kenya',
	})
	@IsString()
	@IsNotEmpty({ message: 'Address is required.' })
	address: string;

	@ApiProperty({
		description: 'The KRA PIN number of the user.',
		example: 'A1234567890',
	})
	@IsString()
	@IsNotEmpty({ message: 'KRA PIN number is required.' })
	kraPinNumber: string;
}
