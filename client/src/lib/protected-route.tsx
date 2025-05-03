import { useQuery } from "@tanstack/react-query";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/user', { credentials: 'include' });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}