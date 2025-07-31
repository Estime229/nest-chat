import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(8001)
export class AppGateway {
  @SubscribeMessage('test')
  sendMessage(@MessageBody() data, @ConnectedSocket() socket: Socket) {
    console.log(data);
    socket.emit('chat', "salut, j'ai recu ton msg");
  }
}
