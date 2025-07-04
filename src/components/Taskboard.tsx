"use client";

import { useState, useMemo } from 'react';
import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { TaskForm } from './TaskForm';
import { PlusCircle, Search, Inbox, List, ListChecks, CheckCircle2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface TaskboardProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
}

type Filter = "all" | "pending" | "completed";

export function Taskboard({ tasks, addTask, updateTask, deleteTask, toggleTaskCompletion }: TaskboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    const sorted = tasks.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return sorted
      .filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true;
      })
      .filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [tasks, filter, searchTerm]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 text-base rounded-full bg-card"
          />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto h-12 rounded-full font-bold text-base">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={addTask} closeForm={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

       <div className="flex justify-center">
        <ToggleGroup type="single" value={filter} onValueChange={(value) => { if (value) setFilter(value as Filter) }} className="bg-card rounded-full p-1.5 border">
            <ToggleGroupItem value="all" aria-label="All tasks" className="rounded-full px-6 text-base data-[state=on]:text-primary-foreground data-[state=on]:bg-primary">
                <List className="mr-2 h-4 w-4" /> All ({taskCounts.all})
            </ToggleGroupItem>
            <ToggleGroupItem value="pending" aria-label="Pending tasks" className="rounded-full px-6 text-base data-[state=on]:text-primary-foreground data-[state=on]:bg-primary">
                <ListChecks className="mr-2 h-4 w-4" /> Pending ({taskCounts.pending})
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="Completed tasks" className="rounded-full px-6 text-base data-[state=on]:text-primary-foreground data-[state=on]:bg-primary">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Completed ({taskCounts.completed})
            </ToggleGroupItem>
        </ToggleGroup>
       </div>
        
      <div>
        {filteredTasks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
                toggleTaskCompletion={toggleTaskCompletion}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-card/50 p-16 text-center mt-12">
            <Inbox className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-6 text-2xl font-semibold text-muted-foreground">No tasks found</h3>
            <p className="mt-2 text-base text-muted-foreground/80">
              There are no tasks matching your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
