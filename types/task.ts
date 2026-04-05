export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId:string;
  createdAt: string;
}

export type CreateTask = {
  title: string;
  description?: string;
  completed?: boolean;
};