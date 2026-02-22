export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';

export interface Project {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description?: string;
  due_date?: string;
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  project_id: string;
  name: string;
  order: number;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  category_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  due_date?: string;
  assignee?: string;
  notes?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithProgress extends Project {
  total_tasks: number;
  completed_tasks: number;
  progress: number;
  categories: CategoryWithTasks[];
}

export interface CategoryWithTasks extends Category {
  tasks: Task[];
}
