import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'roles';
export const Permissions = (
	...permissions: { resource: string; action: string }[]
) => SetMetadata(PERMISSIONS_KEY, permissions);
