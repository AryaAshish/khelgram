import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authService from '@/services/auth.service'

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  role: (userId: string) => [...authKeys.all, 'role', userId] as const,
}

export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: authService.getSession,
  })
}

export function useAdminRole(userId: string | undefined) {
  return useQuery({
    queryKey: authKeys.role(userId ?? 'anonymous'),
    queryFn: () => authService.getAdminRole(userId as string),
    enabled: Boolean(userId),
  })
}

export function useSignIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), null)
      void queryClient.invalidateQueries({ queryKey: authKeys.all })
    },
  })
}
