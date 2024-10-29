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
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('interaction')
@ApiTags('interaction')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InteractionController {
	constructor(private readonly interactionService: InteractionService) {}

	@Post()
	create(
		@Body() createInteractionDto: CreateInteractionDto,
		@Req() req: any,
	) {
		return this.interactionService.create(
			createInteractionDto,
			req.user.id,
		);
	}

	@Get()
	findAll() {
		return this.interactionService.findAll();
	}

	@Get(':interactionId')
	findOne(@Param('interactionId') interactionId: string) {
		return this.interactionService.findOne(interactionId);
	}

	@Patch(':interactionId')
	update(
		@Param('interactionId') interactionId: string,
		@Body() updateInteractionDto: UpdateInteractionDto,
	) {
		return this.interactionService.update(
			interactionId,
			updateInteractionDto,
		);
	}

	@Delete(':interactionId')
	remove(@Param('interactionId') interactionId: string) {
		return this.interactionService.remove(interactionId);
	}
}
