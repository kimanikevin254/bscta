import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UserModule } from 'src/user/user.module';
import { MailService } from 'src/services/mail.service';

@Module({
	controllers: [ProjectController],
	providers: [ProjectService, PrismaService, MailService],
	imports: [UserModule],
})
export class ProjectModule {}
