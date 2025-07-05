"use client";

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const sampleTasks: Task[] = [
    {
      id: 'sample-1',
      title: 'Complete React assignment',
      description: 'Build a task tracker application',
      completed: false,
      priority: 'high',
      category: 'Study',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'sample-2',
      title: 'Review JavaScript concepts',
      description: 'Go through ES6+ features',
      completed: true,
      priority: 'medium',
      category: 'Study',
      createdAt: '2024-01-14T15:30:00Z',
    },
];

export const useTasks = (username: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const storageKey = `tasks-${username}`;

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(storageKey);
      if (storedTasks && JSON.parse(storedTasks).length > 0) {
        const parsedTasks: Task[] = JSON.parse(storedTasks);
        // Add a migration for old tasks that don't have createdAt
        const migratedTasks = parsedTasks.map(task => ({
          ...task,
          createdAt: task.createdAt || task.id, // Fallback to id if createdAt is missing
        }));
        setTasks(migratedTasks);
      } else {
        // If no tasks are stored, initialize with sample data
        setTasks(sampleTasks);
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
      toast({
        title: "Error",
        description: "Could not load your tasks. Please try refreshing the page.",
        variant: "destructive",
      });
      // Fallback to sample tasks on error as well
      setTasks(sampleTasks);
    }
    setIsLoaded(true);
  }, [storageKey, toast]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
      } catch (error)
      {
        console.error("Failed to save tasks to local storage", error);
        toast({
          title: "Error",
          description: "Could not save your tasks. Changes might be lost.",
          variant: "destructive",
        });
      }
    }
  }, [tasks, isLoaded, storageKey, toast]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
    toast({
      title: "Success",
      description: "Task added successfully.",
    });
  }, [toast]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast({
      title: "Success",
      description: "Task updated successfully.",
    });
  }, [toast]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
     toast({
      title: "Success",
      description: "Task deleted successfully.",
    });
  }, [toast]);

  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  return { tasks, isLoaded, addTask, updateTask, deleteTask, toggleTaskCompletion };
};
