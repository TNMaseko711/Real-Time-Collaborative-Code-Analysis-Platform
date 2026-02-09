import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './realtime.module';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = app.getHttpServer();
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    if (request.url?.startsWith('/yjs')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        setupWSConnection(ws, request);
      });
    }
  });

  await app.listen(3001);
  console.log('Realtime API listening on :3001');
}

bootstrap();
