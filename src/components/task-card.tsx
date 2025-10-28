
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { UITask } from "@/lib/types";
import { format } from "date-fns";
import { Calendar, Trash2, Edit, Circle, CheckCircle2, Ellipsis } from "lucide-react";
import { AddTaskDialog } from "./add-task-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

type TaskCardProps = {
  task: UITask;
  onTaskUpdate: (id: string, data: Partial<Omit<UITask, 'id'>>) => void;
  onTaskDelete: (id: string) => void;
  onStatusChange: (id: string, status: UITask['status']) => void;
};

export function TaskCard({ task, onTaskUpdate, onTaskDelete, onStatusChange }: TaskCardProps) {
  
  const handleUpdate = (data: Partial<Omit<UITask, 'id'>>) => {
    onTaskUpdate(task.id, data);
  };
  
  const handleDelete = () => {
    onTaskDelete(task.id);
  };

  const getImportanceBadgeClass = () => {
    switch (task.importance) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  const statusIcons = {
    todo: <Circle className="mr-2 h-4 w-4 text-muted-foreground" />,
    'in-progress': <Ellipsis className="mr-2 h-4 w-4 text-blue-500" />,
    done: <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />,
  }

  return (
    <Card className="flex flex-col h-full bg-card/60 hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-semibold pr-2">{task.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-foreground">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <div className="px-1 py-1">
                  <AddTaskDialog
                    task={task}
                    onTaskUpdate={handleUpdate}
                    onTaskCreate={() => {}}
                    trigger={
                        <button className="w-full text-left text-sm flex items-center rounded-sm px-2 py-1.5 relative select-none outline-none transition-colors hover:bg-accent focus:bg-accent">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </button>
                    }
                  />
                </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center flex-wrap gap-2 pt-1">
          <Badge variant="outline">{task.category}</Badge>
          <Badge className={getImportanceBadgeClass()}>{task.importance}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(task.dueDate, "MMM d")}</span>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="capitalize">
                {statusIcons[task.status]} {task.status.replace('-', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'todo')}>
                {statusIcons.todo} To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
                {statusIcons["in-progress"]} In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                {statusIcons.done} Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

      </CardFooter>
    </Card>
  );
}
