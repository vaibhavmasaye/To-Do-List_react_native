export type MediaType = 'image' | 'video' | null;

export interface Task {
  id: string;
  title: string;
  description?: string;
  mediaUri?: string;
  mediaType?: MediaType;
  createdAt: number; // timestamp
  updatedAt?: number; // timestamp
}

export type TaskFormData = Omit<Task, 'id'>;