"use client";

import { useState, useMemo } from 'react';
import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Input } from './ui/input';
import { TaskForm } from './TaskForm';
import { PlusCircle, Search, Clock, List, CheckCircle, ClipboardList } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card } from './ui/card';

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
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(true);

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
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [tasks, filter, searchTerm]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return (
    <div className="space-y-6">
       <Collapsible open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen} className="w-full">
         <Card>
            <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 font-bold text-lg">
                    <div className="flex items-center">
                        <PlusCircle className="mr-3 h-6 w-6 text-primary" />
                        Create New Task
                    </div>
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">
                 <TaskForm onSubmit={addTask} closeForm={() => setIsCreateFormOpen(false)} />
            </CollapsibleContent>
         </Card>
       </Collapsible>
        
       <Card className="p-4 space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 bg-background"
          />
        </div>
      
        <ToggleGroup type="single" value={filter} onValueChange={(value) => { if (value) setFilter(value as Filter) }} className="w-full justify-start gap-2">
            <ToggleGroupItem value="all" aria-label="All tasks" variant="outline" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <List className="mr-2 h-4 w-4" /> All Tasks <span className="ml-2 text-xs bg-muted-foreground/20 text-muted-foreground rounded-full px-2">{taskCounts.all}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="pending" aria-label="Pending tasks" variant="outline" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <Clock className="mr-2 h-4 w-4" /> Pending <span className="ml-2 text-xs bg-muted-foreground/20 text-muted-foreground rounded-full px-2">{taskCounts.pending}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="Completed tasks" variant="outline" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <CheckCircle className="mr-2 h-4 w-4" /> Completed <span className="ml-2 text-xs bg-muted-foreground/20 text-muted-foreground rounded-full px-2">{taskCounts.completed}</span>
            </ToggleGroupItem>
        </ToggleGroup>
       </Card>
        
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
            <ClipboardList className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-6 text-2xl font-semibold text-muted-foreground">No tasks here</h3>
            <p className="mt-2 text-base text-muted-foreground/80">
              Looks like there are no tasks matching your current search and filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
