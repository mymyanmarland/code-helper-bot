import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, rolesLoading, isAdmin } = useAuth();

  // Wait for auth to load
  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-terminal-prompt animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // For admin routes, wait for roles to load before deciding
  if (requireAdmin) {
    if (rolesLoading) {
      return (
        <div className="min-h-screen bg-terminal-bg flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-terminal-prompt animate-spin" />
        </div>
      );
    }
    
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
