import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.server.emit('presence', { id: client.id, status: 'connected' });
  }

  handleDisconnect(client: Socket) {
    this.server.emit('presence', { id: client.id, status: 'disconnected' });
  }

  @SubscribeMessage('cursor')
  handleCursor(@MessageBody() data: unknown, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('cursor', { ...data, id: client.id });
  }
}
