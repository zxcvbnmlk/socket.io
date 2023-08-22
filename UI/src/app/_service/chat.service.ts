import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public messages$ =  new Subject()
  public message$: Subject<string> = new Subject();
  public users$: Subject<string> = new Subject();
  public credentials = JSON.parse(localStorage.getItem('credentials') || '{}')


  constructor() {

  }


  socket = io(environment.serverSocketUrl, {  query: {
      username: this.credentials.username,
      token: this.credentials.token,
    }});



  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public getUsers = () => {
    this.socket.on('users', (users) => {
      this.users$.next(users);
    });
    return this.users$.asObservable();
  };


  public getNewMessage = () => {
    this.socket.on('message', (message) => {
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };

  public getAllMessages = () => {
    this.socket.on('messageAll', (messages) => {
      this.messages$.next(messages);
    });
    return this.messages$.asObservable()
  };
}
