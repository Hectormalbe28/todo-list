export interface Task {
  id: number;
  name: string;
  completed: boolean;
  editing?: boolean;
  categoryId?: number;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  editing?: boolean;
}
