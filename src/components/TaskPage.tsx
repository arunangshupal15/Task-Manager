"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/use-tasks';
import { Taskboard } from '@/components/Taskboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/lib/types';
import { LogOut, CheckSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function TaskPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      router.replace('/login');
    }
  }, [router]);
  
  const { tasks, isLoaded, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks(username || '');

  const handleLogout = () => {
    localStorage.removeItem('username');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  if (!isClient || !isLoaded || !username) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4 bg-background bg-gradient-soft">
        <div className="w-full max-w-6xl space-y-8">
          <div className="flex justify-between items-center">
             <Skeleton className="h-10 w-48" />
             <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
           <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background bg-gradient-soft text-foreground">
      <header className="sticky top-0 z-40 w-full border-b backdrop-blur-lg bg-background/80 dark:bg-background/50">
        <div className="container flex h-20 items-center">
          <div className="mr-4 flex items-center">
            <CheckSquare className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-2xl font-extrabold font-headline tracking-tight">TaskMaster</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
             <div className="text-right hidden sm:block">
              <p className="font-semibold">{username}</p>
              <p className="text-xs text-muted-foreground">Welcome back!</p>
            </div>
             <Avatar>
              <AvatarFallback>{getInitials(username)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Taskboard
          tasks={tasks}
          addTask={addTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          toggleTaskCompletion={toggleTaskCompletion}
        />
      </main>
    </div>
  );
}
