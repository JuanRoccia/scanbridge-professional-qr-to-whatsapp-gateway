import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientId } from './storage';
export interface Card {
  id: string;
  name: string;
  company: string;
  imageData: string;
  ownerId: string;
  createdAt: number;
}
const API_BASE = '/api/cards';
export function useCards() {
  const ownerId = getClientId();
  return useQuery({
    queryKey: ['cards', ownerId],
    queryFn: async (): Promise<Card[]> => {
      const res = await fetch(`${API_BASE}?ownerId=${ownerId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
export function useCard(id: string | undefined) {
  return useQuery({
    queryKey: ['card', id],
    queryFn: async (): Promise<Card> => {
      if (!id) throw new Error('ID is required');
      const res = await fetch(`${API_BASE}/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    enabled: !!id,
    retry: false,
  });
}
export function useCreateCard() {
  const queryClient = useQueryClient();
  const ownerId = getClientId();
  return useMutation({
    mutationFn: async (data: Partial<Card>): Promise<Card> => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ownerId }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', ownerId] });
    },
  });
}
export function useDeleteCard() {
  const queryClient = useQueryClient();
  const ownerId = getClientId();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_BASE}/${id}?ownerId=${ownerId}`, { 
        method: 'DELETE' 
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', ownerId] });
    },
  });
}