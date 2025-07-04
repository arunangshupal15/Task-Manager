"use client";

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export const useTasks = (username: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const storageKey = `tasks-${username}`;

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(storageKey);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
      toast({
        title: "Error",
        description: "Could not load your tasks. Please try refreshing the page.",
        variant: "destructive",
      });
    }
    setIsLoaded(true);
  }, [storageKey, toast]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to local storage", error);
        toast({
          title: "Error",
          description: "Could not save your tasks. Changes might be lost.",
          variant: "destructive",
        });
      }
    }
  }, [tasks, isLoaded, storageKey, toast]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: new Date().toISOString(),
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
