export enum Priority{
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH= 'High'
}


export enum Status{
    TODO = 'To DO',
    IN_PROGRESS = 'In Progress',
    COMPLTED = 'Completed'
}

export interface Task{
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    status: Status;
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;

}