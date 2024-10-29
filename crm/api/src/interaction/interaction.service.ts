import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class InteractionService {
	constructor(private prismaService: PrismaService) {}

	async create(createInteractionDto: CreateInteractionDto, userId: string) {
		try {
			return await this.prismaService.interaction.create({
				data: { ...createInteractionDto, createdById: userId },
			});
		} catch (error) {
			console.log(error);
			throw new HttpException(
				'SOmething went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findAll() {
		return await this.prismaService.interaction.findMany({
			include: {
				customer: {
					select: {
						name: true,
					},
				},
				lead: {
					select: {
						name: true,
					},
				},
				createdBy: {
					select: {
						name: true,
					},
				},
			},
		});
	}

	async findOne(interactionId: string) {
		try {
			const interaction = await this.prismaService.interaction.findUnique(
				{
					where: { id: interactionId },
				},
			);

			if (!interaction) {
				throw new HttpException(
					'Interaction not found',
					HttpStatus.NOT_FOUND,
				);
			}

			return interaction;
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

	async update(
		interactionId: string,
		updateInteractionDto: UpdateInteractionDto,
	) {
		try {
			// Make sure interaction exists
			const interactionExists = await this.findOne(interactionId);

			// Update
			return await this.prismaService.interaction.update({
				where: { id: interactionExists.id },
				data: { ...updateInteractionDto },
			});
		} catch (error) {
			if (error.status === 404) {
				throw new HttpException(
					'Interaction not found',
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

	async remove(interactionId: string) {
		try {
			// Make sure interaction exists
			const interactionExists = await this.findOne(interactionId);

			// Delete
			return await this.prismaService.interaction.delete({
				where: { id: interactionExists.id },
			});
		} catch (error) {
			if (error.status === 404) {
				throw new HttpException(
					'Interaction not found',
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
