export type Role = {
    name: "ADMIN" | "PROJECT_MANAGER" | "ENGINEER";  
};

export type Permission = {
    resource: string,
    actions: string[],
}
  
export type UserInfo = {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    kraPinNumber: string;
    role: Role;
};

export interface Creator {
    id: string;
    name: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    startDate: string; 
    endDate: string | null; // Optional end date
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    creator: Creator;
}

export interface AssignedUser {
    id: string,
    name: string,
    email: string,
    role: Role
}
