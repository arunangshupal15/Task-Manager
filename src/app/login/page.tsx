"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username.trim());
      router.push('/');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 flex items-center gap-2 text-foreground/80">
        <CheckSquare className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-headline">TaskFlow</h1>
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
        {year && `© ${year} TaskFlow Inc.`}
      </p>
    </div>
  );
}
