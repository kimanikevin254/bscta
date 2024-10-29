import { RolesNames } from '@prisma/client';

export interface Permission {
	resource: string;
	action: string;
}

export interface UserRole {
	name: RolesNames;
	permissions: Permission[];
}

export interface FormattedPermission {
	resource: string;
	actions: string[];
}

export interface FormattedRole {
	name: RolesNames;
	permissions: FormattedPermission[];
}
