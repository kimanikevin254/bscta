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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorators';
import { ProjectAssignmentDto } from './dto/project-assignment.dto';
import { ProjectUnassignmentDto } from './dto/project-unassignment.dto';

// Admin -> create, assign,
// Project manager -> view and edit assigned
// Engineer -> view assigned

@Controller('project')
@ApiTags('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	// Admin
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'project', action: 'CREATE' })
	@Post()
	create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
		return this.projectService.create(createProjectDto, req.user.id);
	}

	// Anyone(authenticated), but return data based on role
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'project', action: 'READ' })
	@Get()
	findAll(@Req() req: any) {
		return this.projectService.findAll(req.user.role, req.user.id);
	}

	// Admins and Anyone(authenticated) who is assigned this project
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'project', action: 'READ' })
	@Get(':projectId')
	findOne(@Param('projectId') projectId: string, @Req() req: any) {
		return this.projectService.findOne(projectId, req.user.role);
	}

	// Admin, Project manager
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'project', action: 'UPDATE' })
	@Patch(':projectId')
	update(
		@Param('projectId') projectId: string,
		@Body() updateProjectDto: UpdateProjectDto,
	) {
		return this.projectService.update(projectId, updateProjectDto);
	}

	// Admin
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'project', action: 'DELETE' })
	@Delete(':projectId')
	remove(@Param('projectId') projectId: string) {
		return this.projectService.remove(projectId);
	}

	// Admin
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'assignment', action: 'CREATE' })
	@Post(':projectId/assign-user')
	assignProject(
		@Body() projectAssignmentDto: ProjectAssignmentDto,
		@Param('projectId') projectId: string,
	) {
		return this.projectService.assignProject(
			projectAssignmentDto,
			projectId,
		);
	}

	// Admin
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'assignment', action: 'DELETE' })
	@Post(':projectId/unassign-user')
	unassignProject(
		@Body() projectUnassignmentDto: ProjectUnassignmentDto,
		@Param('projectId') projectId: string,
	) {
		return this.projectService.unassignProject(
			projectUnassignmentDto,
			projectId,
		);
	}

	// Admin and project manager
	@ApiBearerAuth()
	@UseGuards(AuthenticationGuard, AuthorizationGuard)
	@Permissions({ resource: 'user', action: 'READ' })
	@Get(':projectId/assigned')
	assigned(@Param('projectId') projectId: string) {
		return this.projectService.assigned(projectId);
	}
}
