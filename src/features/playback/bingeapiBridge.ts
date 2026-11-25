import { z } from 'zod'

export const BINGEAPI_ORIGIN = 'https://bingeapi.st'

const eventSchema = z.discriminatedUnion('event', [
  z.object({ source: z.literal('bingeapi_player'), event: z.enum(['play', 'pause', 'ended', 'mute', 'unmute', 'fullscreen', 'exitfullscreen']), info: z.null() }),
  z.object({ source: z.literal('bingeapi_player'), event: z.enum(['time', 'duration', 'seek']), info: z.number().finite().nonnegative() }),
  z.object({ source: z.literal('bingeapi_player'), event: z.literal('volume'), info: z.number().finite().min(0).max(1) }),
  z.object({ source: z.literal('bingeapi_player'), event: z.literal('buffering'), info: z.boolean() }),
  z.object({ source: z.literal('bingeapi_player'), event: z.enum(['serverchange', 'error']), info: z.string().max(500) }),
])

export type BingeApiEvent = z.infer<typeof eventSchema>

export function parseBingeApiMessage(message: Pick<MessageEvent, 'origin' | 'source' | 'data'>, expectedWindow: Window | null): BingeApiEvent | null {
  if (!expectedWindow || message.origin !== BINGEAPI_ORIGIN || message.source !== expectedWindow) return null
  const parsed = eventSchema.safeParse(message.data)
  return parsed.success ? parsed.data : null
}

export function sendBingeApiCommand(target: Window, command: 'play' | 'pause' | 'toggle' | 'seek', value?: number): void {
  if (command === 'seek' && (!Number.isFinite(value) || (value ?? -1) < 0)) throw new Error('Invalid seek position')
  target.postMessage({ source: 'bingeapi_player_command', command, ...(value === undefined ? {} : { value }) }, BINGEAPI_ORIGIN)
}
