export type MediaType = 'image' | 'video' | null;

export interface Task {
  id: string;
  title: string;
  description?: string;
  mediaUri?: string;
  mediaType?: MediaType;
  createdAt: number;
  updatedAt?: number;
}

export type TaskFormData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;