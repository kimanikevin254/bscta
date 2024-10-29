import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/services/prisma.service';
import { LeadService } from 'src/lead/lead.service';
import { ConversionHistoryService } from 'src/conversion-history/conversion-history.service';

@Injectable()
export class CustomerService {
	constructor(
		private prismaService: PrismaService,
		private leadService: LeadService,
		private conversionHistoryService: ConversionHistoryService,
	) {}

	async create(createCustomerDto: CreateCustomerDto, userId: string) {
		try {
			// Make sure lead exists
			const lead = await this.leadService.findOne(
				createCustomerDto.leadId,
			);

			// Make sure lead is not converted yet
			if (lead.status !== 'NEW' && lead.status !== 'IN_PROGRESS') {
				throw new HttpException(
					'Lead must be in NEW or IN_PROGRESS state',
					HttpStatus.BAD_REQUEST,
				);
			}

			// Create customer
			const customer = await this.prismaService.customer.create({
				data: {
					name: lead.name,
					email: lead.email,
					phone: lead.phone,
					companyName: lead.companyName,
					status: 'ACTIVE',
				},
			});

			// Create conversion history
			await this.conversionHistoryService.create({
				leadId: lead.id,
				customerId: customer.id,
				conversionDate: new Date(),
				notes: createCustomerDto.notes,
				convertedById: userId,
				conversionType: 'INITIAL',
			});

			// Mark lead as converted
			await this.leadService.update(lead.id, { status: 'CONVERTED' });
		} catch (error) {
			console.log(error);
			if (error.message === 'No Lead found') {
				throw new HttpException(
					'Lead with provided ID does not exist.',
					HttpStatus.NOT_FOUND,
				);
			} else if (
				error.message === 'Lead must be in NEW or IN_PROGRESS state'
			) {
				throw new HttpException(error.message, error.code);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async findAll() {
		return await this.prismaService.customer.findMany({});
	}

	async findOne(customerId: string) {
		try {
			const customer = await this.prismaService.customer.findUnique({
				where: { id: customerId },
			});

			if (!customer) {
				throw new HttpException(
					'Customer not found',
					HttpStatus.NOT_FOUND,
				);
			}

			return customer;
		} catch (error) {
			if (error.status === 404) {
				throw new HttpException(error.message, HttpStatus.NOT_FOUND);
			}

			// Throw a generic 500 for other errors
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async update(customerId: string, updateCustomerDto: UpdateCustomerDto) {
		try {
			// Make sure customer exists
			const customerExists = await this.findOne(customerId);

			// Update
			return await this.prismaService.customer.update({
				where: { id: customerExists.id },
				data: { ...updateCustomerDto },
			});
		} catch (error) {
			if (error.status === 404) {
				throw new HttpException(
					'Customer not found',
					HttpStatus.NOT_FOUND,
				);
			}

			// Throw a generic 500 for other errors
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async remove(customerId: string) {
		try {
			// Make sure customer exists
			const customerExists = await this.findOne(customerId);

			// Delete
			return await this.prismaService.customer.delete({
				where: { id: customerExists.id },
			});
		} catch (error) {
			console.log(error);
			if (error.status === 404) {
				throw new HttpException(
					'Customer not found',
					HttpStatus.NOT_FOUND,
				);
			}
		}

		// Throw a generic 500 for other errors
		throw new HttpException(
			'Something went wrong',
			HttpStatus.INTERNAL_SERVER_ERROR,
		);
	}
}
