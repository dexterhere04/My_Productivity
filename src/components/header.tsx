
import { Logo } from "./logo";
import { AddTaskDialog } from "./add-task-dialog";
import type { UITask } from "@/lib/types";

type HeaderProps = {
  onTaskCreate: (task: Omit<UITask, 'id' | 'status' | 'priorityScore' | 'reason'>) => void;
};

export function Header({ onTaskCreate }: HeaderProps) {
  return (
    <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <AddTaskDialog onTaskCreate={onTaskCreate} />
      </div>
    </header>
  );
}
