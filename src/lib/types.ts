
// The comprehensive task type used throughout the UI
export type UITask = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  importance: 'low' | 'medium' | 'high';
  category: string;
  status: 'todo' | 'in-progress' | 'done';
};
