import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { SearchLeadsDto } from './dto/search-leads.dto';
import { SearchCustomersDto } from './dto/search-customers.dto';

@Injectable()
export class SearchService {
	constructor(private readonly prismaService: PrismaService) {}

	async searchLeads(dto: SearchLeadsDto) {
		const query = {
			where: {
				...(dto.name && {
					name: { contains: dto.name, mode: 'insensitive' },
				}),
				...(dto.email && {
					email: { contains: dto.email, mode: 'insensitive' },
				}),
				...(dto.status && { status: dto.status }),
			},
		};
		return this.prismaService.lead.findMany(query);
	}

	async searchCustomers(dto: SearchCustomersDto) {
		const query = {
			where: {
				...(dto.name && {
					name: { contains: dto.name, mode: 'insensitive' },
				}),
				...(dto.email && {
					email: { contains: dto.email, mode: 'insensitive' },
				}),
				...(dto.status && { status: dto.status }),
			},
		};
		return this.prismaService.customer.findMany(query);
	}
}
