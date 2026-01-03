import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threatAPI } from '@/services/threatAPI';
import { IOCType } from '@/types/threat';

// Hook for fetching stats
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => threatAPI.getStats(),
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}

// Hook for fetching recent lookups
export function useRecentLookups(limit: number = 10) {
  return useQuery({
    queryKey: ['recentLookups', limit],
    queryFn: () => threatAPI.getRecentLookups(limit),
    staleTime: 10000, // 10 seconds
    retry: 2,
  });
}

// Hook for IOC lookup mutation
export function useIOCLookup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ value, type }: { value: string; type: IOCType }) =>
      threatAPI.lookupIOC(value, type),
    onSuccess: () => {
      // Invalidate related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['recentLookups'] });
    },
  });
}

// Hook for health check
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => threatAPI.healthCheck(),
    staleTime: 60000, // 1 minute
    retry: 1,
    refetchInterval: 60000, // Check every minute
  });
}
