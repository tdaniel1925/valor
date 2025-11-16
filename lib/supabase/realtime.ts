// Supabase Realtime utilities for real-time updates
import { createClient } from "./client"
import { RealtimeChannel } from "@supabase/supabase-js"

export function subscribeToTable(
  table: string,
  callback: (payload: any) => void
): RealtimeChannel {
  const supabase = createClient()
  
  return supabase
    .channel(`${table}_changes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
      },
      callback
    )
    .subscribe()
}

export function unsubscribe(channel: RealtimeChannel) {
  const supabase = createClient()
  supabase.removeChannel(channel)
}

