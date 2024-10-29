import { Module } from '@nestjs/common';
import { ConversionHistoryService } from './conversion-history.service';
import { ConversionHistoryController } from './conversion-history.controller';
import { PrismaService } from 'src/services/prisma.service';

@Module({
	controllers: [ConversionHistoryController],
	providers: [ConversionHistoryService, PrismaService],
	exports: [ConversionHistoryService],
})
export class ConversionHistoryModule {}
