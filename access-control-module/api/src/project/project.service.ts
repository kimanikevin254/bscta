import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/user/user.service';
import { FormattedRole } from 'src/user/interfaces/role.interface';
import { ProjectAssignmentDto } from './dto/project-assignment.dto';
import { MailService } from 'src/services/mail.service';
import { ProjectUnassignmentDto } from './dto/project-unassignment.dto';

@Injectable()
export class ProjectService {
	constructor(
		private prismaService: PrismaService,
		private userService: UserService,
		private mailService: MailService,
	) {}

	async create(createProjectDto: CreateProjectDto, userId: string) {
		try {
			const user = await this.userService.findOne({ id: userId });

			return await this.prismaService.project.create({
				data: {
					...createProjectDto,
					creator: {
						connect: {
							id: user.id,
						},
					},
				},
			});
		} catch (error) {
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findAll(role: FormattedRole, userId: string) {
		if (role.name === 'ADMIN') {
			return await this.prismaService.project.findMany({
				include: {
					creator: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});
		} else {
			const assignments = await this.prismaService.assignment.findMany({
				where: {
					userId,
				},
				select: {
					project: {
						include: {
							creator: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});

			return assignments.map((assignment) => assignment.project);
		}
	}

	async findOne(projectId: string, role: FormattedRole) {
		try {
			if (role.name === 'ADMIN') {
				return await this.prismaService.project.findUniqueOrThrow({
					where: { id: projectId },
				});
			} else {
				const assignment =
					await this.prismaService.assignment.findFirstOrThrow({
						where: { projectId },
						select: {
							project: true,
						},
					});

				return assignment.project;
			}
		} catch (error) {
			if (
				error.message === 'No Project found' ||
				error.message === 'No Assignment found'
			) {
				throw new HttpException(
					'Project not found',
					HttpStatus.NOT_FOUND,
				);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async update(projectId: string, updateProjectDto: UpdateProjectDto) {
		try {
			return await this.prismaService.project.update({
				where: { id: projectId },
				data: { ...updateProjectDto },
			});
		} catch (error) {
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async remove(projectId: string) {
		try {
			return await this.prismaService.project.delete({
				where: { id: projectId },
			});
		} catch (error) {
			throw new HttpException(
				'Something went wrong',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async assignProject(
		projectAssignmentDto: ProjectAssignmentDto,
		projectId: string,
	) {
		try {
			// Make sure project exists
			const project = await this.prismaService.project.findUniqueOrThrow({
				where: { id: projectId },
			});

			// Make sure user exists
			const user = await this.userService.findOne({
				email: projectAssignmentDto.email,
			});

			if (!user) {
				throw new HttpException('No User found', HttpStatus.NOT_FOUND);
			}

			// Make sure user is not assigned this project already
			const alreadyAssigned =
				await this.prismaService.assignment.findFirst({
					where: {
						userId: user.id,
						projectId,
					},
				});

			if (alreadyAssigned) {
				throw new HttpException(
					'User is already assigned this project',
					HttpStatus.BAD_REQUEST,
				);
			}

			// Create assignment
			await this.prismaService.assignment.create({
				data: {
					userId: user.id,
					projectId: project.id,
					assignedAt: new Date(),
				},
			});

			// Send email to user
			await this.mailService.sendProjectAssignmentMail(
				user.email,
				user.name,
				project.name,
			);

			return {
				message: 'User has been assigned successfully',
			};
		} catch (error) {
			if (
				error.message === 'No User found' ||
				error.message === 'No Project found'
			) {
				throw new HttpException(
					'User or Project does not exist',
					HttpStatus.NOT_FOUND,
				);
			} else if (
				error.message === 'User is already assigned this project'
			) {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async unassignProject(
		projectUnassignmentDto: ProjectUnassignmentDto,
		projectId: string,
	) {
		try {
			// Make sure user exists
			const user = await this.userService.findOne({
				id: projectUnassignmentDto.userId,
			});

			if (!user) {
				throw new HttpException('No User found', HttpStatus.NOT_FOUND);
			}

			// Make sure user is assigned this project
			const assignment = await this.prismaService.assignment.findFirst({
				where: {
					userId: user.id,
					projectId,
				},
				include: {
					user: {
						select: {
							name: true,
							email: true,
						},
					},
					project: {
						select: {
							name: true,
						},
					},
				},
			});

			if (!assignment) {
				throw new HttpException(
					'User has not been assigned this project',
					HttpStatus.BAD_REQUEST,
				);
			}

			// Unassign project
			await this.prismaService.assignment.delete({
				where: {
					id: assignment.id,
				},
			});

			// Send email to user
			await this.mailService.sendProjectUnassignmentMail(
				assignment.user.email,
				assignment.user.name,
				assignment.project.name,
			);

			return {
				message: 'User has been assigned successfully',
			};
		} catch (error) {
			if (
				error.message === 'No User found' ||
				error.message === 'No Project found'
			) {
				throw new HttpException(
					'User or Project does not exist',
					HttpStatus.NOT_FOUND,
				);
			} else if (
				error.message === 'User is already assigned this project'
			) {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			} else {
				throw new HttpException(
					'Something went wrong',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async assigned(projectId: string) {
		// Make sure project exists
		const project = await this.prismaService.project.findUniqueOrThrow({
			where: { id: projectId },
		});

		if (!project) {
			throw new HttpException('Invalid project ID', HttpStatus.NOT_FOUND);
		}

		const assignment = await this.prismaService.assignment.findMany({
			where: {
				projectId,
			},
			select: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						role: {
							select: {
								name: true,
							},
						},
					},
				},
			},
		});

		return assignment.map((ass) => ass.user);
	}
}
