import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
	controllers: [InteractionController],
	providers: [InteractionService, PrismaService],
})
export class InteractionModule {}
