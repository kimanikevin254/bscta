import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ConversionHistoryService } from './conversion-history.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('conversion-history')
@ApiTags('conversion-history')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ConversionHistoryController {
	constructor(
		private readonly conversionHistoryService: ConversionHistoryService,
	) {}

	@Get()
	findAll() {
		return this.conversionHistoryService.findAll();
	}

	@Get(':historyId')
	findOne(@Param('historyId') historyId: string) {
		return this.conversionHistoryService.findOne(historyId);
	}
}
