import { Module } from '@nestjs/common';
import { MailService } from 'src/services/mail.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, PrismaService, MailService],
	imports: [UserModule],
})
export class AuthModule {}
