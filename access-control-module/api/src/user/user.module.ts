import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailService } from 'src/services/mail.service';

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, MailService],
	exports: [UserService],
	imports: [],
})
export class UserModule {}
