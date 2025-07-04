"use client";

import { useState } from 'react';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { TaskForm } from './TaskForm';
import { Edit, Trash2, Calendar, Flag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
}

const priorityStyles = {
  low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
  medium: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
  high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
};

export function TaskCard({ task, updateTask, deleteTask, toggleTaskCompletion }: TaskCardProps) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  return (
    <Card className={cn(
      "flex flex-col transition-all duration-300",
      task.completed ? "bg-card/50 dark:bg-card/30" : "bg-card"
    )}>
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
        <Checkbox
          id={`complete-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => toggleTaskCompletion(task.id)}
          className="mt-1"
          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1">
          <CardTitle className={cn("text-lg", task.completed && "line-through text-muted-foreground")}>
            {task.title}
          </CardTitle>
          {task.description && (
            <CardDescription className={cn("mt-1", task.completed && "line-through")}>
              {task.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Flag className="h-4 w-4" />
            <Badge variant="outline" className={cn("capitalize", priorityStyles[task.priority])}>
              {task.priority} Priority
            </Badge>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(parseISO(task.dueDate), 'PPP')}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Edit task">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm task={task} onSubmit={updateTask} closeForm={() => setIsEditFormOpen(false)} />
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="Delete task">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task "{task.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
