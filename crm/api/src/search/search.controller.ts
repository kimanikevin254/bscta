import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SearchLeadsDto } from './dto/search-leads.dto';
import { SearchCustomersDto } from './dto/search-customers.dto';

@Controller('search')
@UseGuards(AuthGuard)
@ApiTags('search')
@ApiBearerAuth()
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Post('leads')
	searchLeads(@Body() searchLeadsDto: SearchLeadsDto) {
		return this.searchService.searchLeads(searchLeadsDto);
	}

	@Post('customers')
	searchCustomers(@Body() searchCustomersDto: SearchCustomersDto) {
		return this.searchService.searchCustomers(searchCustomersDto);
	}
}
