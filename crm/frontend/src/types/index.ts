export type LeadType = 'NEW' | 'IN_PROGRESS' | 'CONVERTED' | 'CLOSED';
export type InteractionType = 'PHONE_CALL' | 'EMAIL' | 'MEETING'

export type Lead = {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    status: LeadType;
    createdAt: string;
    updatedAt: string;
}

export type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    status: LeadType;
    createdAt: string;
    updatedAt: string;
}

type CreatedBy = {
    name: string;
}

export type Interaction = {
    id: string;
    leadId: string;
    lead?: Lead;
    customerId: string;
    customer?: Customer;
    interactionType: InteractionType;
    date: string;
    notes: string;
    createdById: string;
    createdBy: CreatedBy;
    createdAt: string;
    updatedAt: string;
}