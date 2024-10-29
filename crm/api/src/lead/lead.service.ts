import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from 'src/services/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class LeadService {
	constructor(private prismaService: PrismaService) {}

	async create(createLeadDto: CreateLeadDto, userId: string) {
		try {
			return await this.prismaService.lead.create({
				data: {
					...createLeadDto,
					addedById: userId,
					status: 'NEW',
				},
			});
		} catch (error) {
			console.log(error);
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					// Lead with the provided email already exists
					throw new HttpException(
						'User with the provided email address already exists',
						HttpStatus.BAD_REQUEST,
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

	findAll() {
		return this.prismaService.lead.findMany({});
	}

	async findOne(leadId: string) {
		return await this.prismaService.lead.findUniqueOrThrow({
			where: { id: leadId },
		});
	}

	async update(leadId: string, updateLeadDto: UpdateLeadDto) {
		try {
			// Make sure lead exists
			const lead = await this.findOne(leadId);

			return this.prismaService.lead.update({
				where: { id: lead.id },
				data: { ...updateLeadDto },
			});
		} catch (error) {
			console.log(error);

			if (error.message === 'No Lead found') {
				throw new HttpException(
					'Invalid lead ID',
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

	async remove(leadId: string) {
		try {
			// Make sure lead exists
			const lead = await this.findOne(leadId);

			// Delete
			return await this.prismaService.lead.delete({
				where: { id: lead.id },
			});
		} catch (error) {
			if (error.message === 'No Lead found') {
				throw new HttpException(
					'Invalid lead ID',
					HttpStatus.NOT_FOUND,
				);
			} else {
				// Throw a generic 500 for other errors
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}
}
