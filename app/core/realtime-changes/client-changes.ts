import { supabase } from '@/lib/supabase/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Client } from '../types/types';

export const ClientRealTimeChanges = (callbacks: {
  deleteStoreClient: (id: number) => void;
  addStoreClient: (client: Client) => void;
  updateStoreClient: (client: Client) => void;
}): RealtimeChannel => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'Clients' },
      (payload) => {
        if (payload.eventType === 'DELETE') {
          const deletedClientId = payload.old.client_id;
          callbacks.deleteStoreClient(deletedClientId);
        } else if (payload.eventType === 'INSERT') {
          const newClient = payload.new;
          callbacks.addStoreClient(newClient as Client);
        } else if (payload.eventType === 'UPDATE') {
          const updatedClient = payload.new;
          callbacks.updateStoreClient(updatedClient as Client);
        }
      }
    )
    .subscribe();
  return channel;
};
