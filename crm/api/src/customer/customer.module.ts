import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { LeadModule } from 'src/lead/lead.module';
import { PrismaService } from 'src/services/prisma.service';
import { ConversionHistoryModule } from 'src/conversion-history/conversion-history.module';

@Module({
	controllers: [CustomerController],
	providers: [CustomerService, PrismaService],
	imports: [LeadModule, ConversionHistoryModule],
})
export class CustomerModule {}
