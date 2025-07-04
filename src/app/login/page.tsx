"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username.trim());
      router.push('/');
    }
  };

  if (!isClient) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm flex flex-col items-center gap-8">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-[380px] w-full" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 flex items-center gap-2 text-foreground/80">
        <CheckSquare className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-headline">TaskMaster</h1>
      </div>
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">
            Welcome!
          </CardTitle>
          <CardDescription>
            Enter your username to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. jane_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="text-base h-11"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11 text-base font-bold">
              Continue &rarr;
            </Button>
          </CardFooter>
        </form>
      </Card>
       <p className="text-center text-xs text-muted-foreground mt-8 h-4">
        © {new Date().getFullYear()} TaskMaster Inc.
      </p>
    </div>
  );
}
