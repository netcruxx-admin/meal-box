import { useGetProfileQuery } from '@/services/userApi';
import { isProfileComplete } from '@/utils/profileValidation';
import { useRouter, usePathname } from 'expo-router';
import { useEffect } from 'react';

export function useProfileCompletion() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, error } = useGetProfileQuery(undefined);

  const user = data?.user;
  const profileComplete = isProfileComplete(user);

  useEffect(() => {
    if (isLoading) return;

    const isApiError = (error: unknown): error is { data: { message?: string } } => {
      return typeof error === 'object' && error !== null && 'data' in error;
    };

    if (isApiError(error) && error.data?.message === 'User profile not found') {
      if (!pathname.includes('EditProfileScreen')) {
        router.replace('/(tabs)/Profile/EditProfileScreen');
      }
      return;
    }

    if (user && !profileComplete) {
      if (!pathname.includes('EditProfileScreen')) {
        router.replace('/(tabs)/Profile/EditProfileScreen');
      }
    }
  }, [isLoading, user, profileComplete, pathname, error, router]);

  return {
    user,
    isLoading,
    profileComplete,
  };
}
