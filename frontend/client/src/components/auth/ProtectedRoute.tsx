import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Route, Redirect } from 'wouter';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  [key: string]: any; // Allow other props like 'section'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <Route {...rest}>
      {(params) => {
        if (!user) {
          return <Redirect to="/login" />;
        }
        
        // The route matches, render the component.
        // The `params` object contains the route parameters.
        return <Component {...rest} params={params} />;
      }}
    </Route>
  );
};

export default ProtectedRoute;
