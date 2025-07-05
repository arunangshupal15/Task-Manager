"use client";

import { useState } from 'react';
import { Task, Priority } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { TaskForm } from './TaskForm';
import { Edit, Trash2, Calendar, ChevronsUp, ChevronUp, Equal, ChevronDown, Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';

interface TaskCardProps {
  task: Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  animationDelay?: number;
}

const priorityIcons: Record<Priority, React.ElementType> = {
  urgent: ChevronsUp,
  high: ChevronUp,
  medium: Equal,
  low: ChevronDown,
};

const priorityStyles: Record<Priority, string> = {
  urgent: "text-destructive",
  high: "text-warning",
  medium: "text-primary",
  low: "text-success",
};

export function TaskCard({ task, updateTask, deleteTask, toggleTaskCompletion, animationDelay = 0 }: TaskCardProps) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const PriorityIcon = priorityIcons[task.priority];

  return (
    <Card 
        className={cn(
            "flex flex-col rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:-translate-y-1.5 opacity-0 animate-pop-in",
            task.completed ? "bg-card/80 dark:bg-card/60" : "bg-card"
        )}
        style={{ animationDelay: `${animationDelay}ms`, animationFillMode: 'forwards' }}
    >
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-3">
        <Checkbox
          id={`complete-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => toggleTaskCompletion(task.id)}
          className="mt-1 w-5 h-5 border-[3px] data-[state=checked]:border-primary"
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1">
          <CardTitle className={cn("text-lg font-semibold", task.completed && "line-through text-muted-foreground")}>
            {task.title}
          </CardTitle>
          {task.description && (
            <p className={cn("mt-1 text-sm text-muted-foreground line-clamp-2", task.completed && "line-through")}>
              {task.description}
            </p>
          )}
        </div>
         {task.category && <Badge variant="secondary">{task.category}</Badge>}
      </CardHeader>
      <CardContent className="flex-grow pb-4 space-y-2">
        {task.createdAt && (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Clock className="h-4 w-4" />
                <span>Created: {format(parseISO(task.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
        )}
        {task.dueDate && (
            <div className="flex items-center text-sm text-muted-foreground gap-2">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("flex items-center gap-1 capitalize", priorityStyles[task.priority])}>
                  <PriorityIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">{task.priority}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-1">
          <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="Edit task">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <TaskForm task={task} onSubmit={updateTask} closeForm={() => setIsEditFormOpen(false)} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" aria-label="Delete task">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task "{task.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Task
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
