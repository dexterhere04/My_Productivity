
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/header';
import { TaskCard } from '@/components/task-card';
import type { UITask } from '@/lib/types';
import { LayoutGrid, List, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { isSameDay } from 'date-fns';
import Loading from './loading';

const getInitialTasks = (): UITask[] => [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create mockups and wireframes for the new V2 landing page.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    importance: 'high',
    category: 'Design',
    status: 'in-progress',
  },
  {
    id: '2',
    title: 'Develop user authentication',
    description: 'Implement JWT-based authentication for the main application.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    importance: 'high',
    category: 'Development',
    status: 'todo',
  },
  {
    id: '3',
    title: 'Write blog post about Q2 updates',
    description: 'Draft, review, and publish a new blog post.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    importance: 'medium',
    category: 'Marketing',
    status: 'todo',
  },
  {
    id: '4',
    title: 'Fix mobile responsiveness bug',
    description: 'The main dashboard is not rendering correctly on small screens.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    importance: 'medium',
    category: 'Development',
    status: 'done'
  }
];

export default function Home() {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const { toast } = useToast();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("board");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
        }));
        setTasks(parsedTasks);
      } else {
        setTasks(getInitialTasks());
      }
    } catch (error) {
      console.error("Failed to read tasks from localStorage", error);
      setTasks(getInitialTasks());
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks, isMounted]);

  const handleCreateTask = (data: Omit<UITask, 'id' | 'status'>) => {
    const newTask: UITask = {
      ...data,
      id: crypto.randomUUID(),
      status: 'todo',
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Created",
      description: `"${data.title}" has been added to your list.`,
    });
  };

  const handleUpdateTask = (id: string, data: Partial<Omit<UITask, 'id'>>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
    toast({
      title: "Task Updated",
      description: "Your task has been successfully updated.",
    });
  };
  
  const handleStatusChange = (id: string, status: UITask['status']) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const handleDeleteTask = (id:string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Task Deleted",
      variant: "destructive",
      description: "The task has been removed.",
    });
  };

  const columns = useMemo(() => {
    let filteredTasks = tasks;
    if (activeTab === 'calendar' && calendarDate) {
        filteredTasks = tasks.filter(task => isSameDay(task.dueDate, calendarDate));
    }
    const sortedTasks = [...filteredTasks].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    return {
        todo: sortedTasks.filter(t => t.status === 'todo'),
        'in-progress': sortedTasks.filter(t => t.status === 'in-progress'),
        done: sortedTasks.filter(t => t.status === 'done'),
    };
  }, [tasks, calendarDate, activeTab]);

  const taskDueDates = useMemo(() => tasks.map(task => task.dueDate), [tasks]);

  const sortedListTasks = useMemo(() => {
    return [...tasks].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
  }, [tasks]);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onTaskCreate={handleCreateTask} />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Tasks</h2>
                <TabsList>
                    <TabsTrigger value="board"><LayoutGrid className="mr-2 h-4 w-4"/> Board</TabsTrigger>
                    <TabsTrigger value="list"><List className="mr-2 h-4 w-4" /> List</TabsTrigger>
                    <TabsTrigger value="calendar"><CalendarIcon className="mr-2 h-4 w-4" /> Calendar</TabsTrigger>
                </TabsList>
            </div>
          
            {tasks.length > 0 ? (
                <>
                    <TabsContent value="board">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="space-y-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-center text-muted-foreground">To Do ({columns.todo.length})</h3>
                        {columns.todo.map(task => (
                            <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                        ))}
                        </div>
                        <div className="space-y-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-center text-muted-foreground">In Progress ({columns['in-progress'].length})</h3>
                        {columns['in-progress'].map(task => (
                            <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                        ))}
                        </div>
                        <div className="space-y-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-center text-muted-foreground">Done ({columns.done.length})</h3>
                        {columns.done.map(task => (
                            <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                        ))}
                        </div>
                    </div>
                    </TabsContent>
                    <TabsContent value="list">
                    <div className="space-y-2">
                        {sortedListTasks.map(task => (
                        <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                        ))}
                    </div>
                    </TabsContent>
                    <TabsContent value="calendar">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                            <div className="md:col-span-1 flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={calendarDate}
                                    onSelect={setCalendarDate}
                                    className="rounded-md border"
                                    modifiers={{
                                        due: taskDueDates,
                                    }}
                                    modifiersClassNames={{
                                        due: 'bg-primary/20 rounded-full',
                                    }}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-lg font-semibold text-center">
                                    Tasks for {calendarDate ? calendarDate.toLocaleDateString() : 'all dates'}
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                                    <div className="space-y-4">
                                        <h3 className="text-base font-semibold text-center text-muted-foreground">To Do ({columns.todo.length})</h3>
                                        {columns.todo.map(task => (
                                            <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-base font-semibold text-center text-muted-foreground">In Progress ({columns['in-progress'].length})</h3>
                                        {columns['in-progress'].map(task => (
                                            <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-base font-semibold text-center text-muted-foreground">Done ({columns.done.length})</h3>
                                        {columns.done.map(task => (
                                            <TaskCard key={task.id} task={task} onTaskUpdate={handleUpdateTask} onTaskDelete={handleDeleteTask} onStatusChange={handleStatusChange} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </>
            ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
                <h3 className="text-xl font-semibold">No tasks yet!</h3>
                <p className="text-muted-foreground mt-2">Click "Add Task" to get started.</p>
            </div>
            )}
        </Tabs>
      </main>
    </div>
  );
}
