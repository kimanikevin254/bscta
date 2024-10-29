import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('lead')
@ApiTags('lead')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class LeadController {
	constructor(private readonly leadService: LeadService) {}

	@Post()
	create(@Body() createLeadDto: CreateLeadDto, @Req() req: any) {
		return this.leadService.create(createLeadDto, req.user.id);
	}

	@Get()
	findAll() {
		return this.leadService.findAll();
	}

	@Get(':leadId')
	findOne(@Param('leadId') leadId: string) {
		return this.leadService.findOne(leadId);
	}

	@Patch(':leadId')
	update(
		@Param('leadId') leadId: string,
		@Body() updateLeadDto: UpdateLeadDto,
	) {
		return this.leadService.update(leadId, updateLeadDto);
	}

	@Delete(':leadId')
	remove(@Param('leadId') leadId: string) {
		return this.leadService.remove(leadId);
	}
}
