import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorators';
import { FormattedRole } from 'src/user/interfaces/role.interface';

@Injectable()
export class AuthorizationGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const requiredPermissions = this.reflector.getAllAndOverride<
			{ resource: string; action: string }[]
		>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

		// Allow request to proceed no RBAC is required
		if (!requiredPermissions) {
			return true;
		}

		// Get user info
		const { user } = context.switchToHttp().getRequest();

		const hasPermission = this.hasRequiredPermissions(
			user.role,
			requiredPermissions,
		);

		return hasPermission;
	}

	// Utility function to check if all required permissions are contained in the role's permissions
	private hasRequiredPermissions(
		rolePermissions: FormattedRole,
		requiredPermissions: { resource: string; action: string }[],
	) {
		// Map for quick lookup of permissions by resource
		const permissionsMap = new Map();

		// Populate map with roles permissions
		rolePermissions.permissions.forEach((perm) => {
			permissionsMap.set(perm.resource, new Set(perm.actions));
		});

		// Check each required permission
		return requiredPermissions.every((required) => {
			// Get set of actions for the resource in the role's permissions
			const actions = permissionsMap.get(required.resource);

			// Ensure that action exists in the set of actions for the resource
			return actions && actions.has(required.action);
		});
	}
}
