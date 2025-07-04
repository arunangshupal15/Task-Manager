"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/use-tasks';
import { Taskboard } from '@/components/Taskboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/lib/types';
import { LogOut, ListTodo, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';

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

  if (!isClient || !isLoaded || !username) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex justify-between items-center">
             <Skeleton className="h-10 w-48" />
             <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <ListTodo className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold font-headline">TaskMaster</h1>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <span className="hidden sm:inline-block">Welcome, {username}!</span>
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
