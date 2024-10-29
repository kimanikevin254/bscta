import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';

async function createRolesAndPermissions() {
	// Define permissions
	const permissions: { resource: string; actions: string[] }[] = [
		{ resource: 'user', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'] },
		{
			resource: 'project',
			actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
		},
		{
			resource: 'assignment',
			actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
		},
	];

	// Upsert permissions
	const createdPermissions = [];

	for (const perm of permissions) {
		for (const action of perm.actions) {
			const permission = await prisma.permission.upsert({
				where: {
					resource_action: { resource: perm.resource, action },
				},
				update: {}, // No update neeed as we are just ensuring existence of permission
				create: {
					resource: perm.resource,
					action: action,
				},
			});

			createdPermissions.push(permission);
		}
	}

	// Helper function to retrieve permissions by resource and actions
	const getPermissions = (resource: string, actions: string[]) =>
		createdPermissions.filter(
			(perm) =>
				perm.resource === resource && actions.includes(perm.action),
		);

	// Upsert roles and insert permissions
	await prisma.role.upsert({
		where: { name: 'ADMIN' },
		update: {},
		create: {
			name: 'ADMIN',
			description: 'Admin can perform CRUD operations on all data',
			permissions: {
				connect: getPermissions('project', [
					'CREATE',
					'READ',
					'UPDATE',
					'DELETE',
				])
					.concat(
						getPermissions('user', [
							'CREATE',
							'READ',
							'UPDATE',
							'DELETE',
						]),
					)
					.concat(
						getPermissions('assignment', [
							'CREATE',
							'READ',
							'UPDATE',
							'DELETE',
						]),
					)
					.map((perm) => ({ id: perm.id })),
			},
		},
	});

	await prisma.role.upsert({
		where: { name: 'PROJECT_MANAGER' },
		update: {},
		create: {
			name: 'PROJECT_MANAGER',
			description:
				'Project Manager can view and edit assigned projects, and view all users.',
			permissions: {
				connect: getPermissions('project', ['READ', 'UPDATE'])
					.concat(getPermissions('user', ['READ']))
					.map((perm) => ({ id: perm.id })),
			},
		},
	});

	await prisma.role.upsert({
		where: { name: 'ENGINEER' },
		update: {},
		create: {
			name: 'ENGINEER',
			description: 'Engineer can view assigned projects only.',
			permissions: {
				connect: getPermissions('project', ['READ']).map((perm) => ({
					id: perm.id,
				})),
			},
		},
	});

	// Query created roles and permissions
	const roles = await prisma.role.findMany({
		select: {
			name: true,
			permissions: {
				select: {
					resource: true,
					action: true,
				},
			},
		},
	});

	// Transform the response using a Map for each role
	const formattedRoles = roles.map((role) => {
		const permissionsMap: { [resource: string]: string[] } = {};

		// Loop through each permission and add actions to the respective resource
		role.permissions.forEach((permission) => {
			if (!permissionsMap[permission.resource]) {
				permissionsMap[permission.resource] = []; // Initialize if not exists
			}
			permissionsMap[permission.resource].push(permission.action);
		});

		// Convert the permissionsMap back to the desired format
		const permissions = Object.entries(permissionsMap).map(
			([resource, actions]) => ({
				resource,
				actions,
			}),
		);

		return {
			name: role.name,
			permissions,
		};
	});

	console.log(
		'Successfully created roles and permissions',
		JSON.stringify(formattedRoles, null, 2),
	);
}

async function createAdmin() {
	// Retrieve admin role
	const adminRole = await prisma.role.findFirst({
		where: { name: 'ADMIN' },
	});

	// Create admin user
	const adminPassword = 'SuperstrongPwd!';

	const admin = await prisma.user.upsert({
		where: { email: 'kimanikevin254@gmail.com' },
		update: {},
		create: {
			name: 'Kevin Kimani',
			email: 'kimanikevin254@gmail.com',
			phoneNumber: '+254758202697',
			address: 'Juja, Kiambu, Kenya',
			kraPinNumber: 'A130054HHH',
			passwordHash: await bcrypt.hash(adminPassword, 10),
			emailVerifiedAt: new Date(),
			roleId: adminRole.id,
		},
		select: {
			email: true,
		},
	});

	console.log('Admin user successfully created with these details', {
		...admin,
		password: adminPassword,
	});
}

createRolesAndPermissions()
	.then(() => createAdmin())
	.catch((e) => {
		console.log('An error occured while seeding the database');
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
