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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('customer')
@ApiTags('customer')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CustomerController {
	constructor(private readonly customerService: CustomerService) {}

	@Post()
	create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: any) {
		return this.customerService.create(createCustomerDto, req.user.id);
	}

	@Get()
	findAll() {
		return this.customerService.findAll();
	}

	@Get(':customerId')
	findOne(@Param('customerId') customerId: string) {
		return this.customerService.findOne(customerId);
	}

	@Patch(':customerId')
	update(
		@Param('customerId') customerId: string,
		@Body() updateCustomerDto: UpdateCustomerDto,
	) {
		return this.customerService.update(customerId, updateCustomerDto);
	}

	@Delete(':customerId')
	remove(@Param('customerId') customerId: string) {
		return this.customerService.remove(customerId);
	}
}
