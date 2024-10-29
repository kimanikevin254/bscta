import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConversionHistoryDto } from './dto/create-conversion-history.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ConversionHistoryService {
	constructor(private prismaService: PrismaService) {}

	async create(createConversionHistoryDto: CreateConversionHistoryDto) {
		try {
			return await this.prismaService.conversionHistory.create({
				data: { ...createConversionHistoryDto },
			});
		} catch (error) {
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findAll() {
		return await this.prismaService.conversionHistory.findMany({});
	}

	async findOne(historyId: string) {
		try {
			const conversionHistory =
				await this.prismaService.conversionHistory.findUnique({
					where: { id: historyId },
				});

			if (!conversionHistory) {
				throw new HttpException(
					'Conversion history not found',
					HttpStatus.NOT_FOUND,
				);
			}

			return conversionHistory;
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
}
