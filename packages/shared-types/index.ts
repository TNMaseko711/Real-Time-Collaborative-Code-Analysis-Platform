export type PresenceEvent = {
  id: string;
  status: 'connected' | 'disconnected';
};

export type CursorEvent = {
  id: string;
  line: number;
  column: number;
};
