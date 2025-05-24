import { RootState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { router, useRootNavigation, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const navigation = useRootNavigation();
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (!navigation?.isReady) return;

    const isLoginScreen = segments.join('/') === 'login';

    if (!isAuthenticated && !isLoginScreen) {
      // Redirect to the login page if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && isLoginScreen) {
      // Redirect to home if already authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, navigation?.isReady]);

  return <>{children}</>;
}
