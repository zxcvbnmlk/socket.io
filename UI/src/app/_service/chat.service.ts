import {Injectable} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '@env/environment';
import {message, users} from "@app/_models/shell";
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | undefined;

  constructor() {
  }
  getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket is not initialized')
    }
    return this.socket
  }

  public sendMessage(message: string) {
    this.getSocket().emit('message', message);
  }

  public getUsers(): Observable<users[]> {
    return fromEvent<users[]>(this.getSocket(), 'users');
  };

  public getNewMessage(): Observable<message> {
    return fromEvent(this.getSocket(), 'message');
  };

  public getAllMessages(): Observable<message[]>  {
    return fromEvent<message[]>(this.getSocket(), 'messageAll');
  };

  public disconnect = () => {
    this.getSocket().disconnect();
  };
  public connect = () => {
    const credentials = JSON.parse(localStorage.getItem('credentials') || '');
    this.socket = io(environment.serverSocketUrl, {
      query: {
        username: credentials.username,
        token: credentials.token,
      },
    });
    this.getSocket().connect();
  };
}
