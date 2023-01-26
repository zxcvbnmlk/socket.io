import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '@env/environment';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  public users$: BehaviorSubject<string> = new BehaviorSubject('');
  public credentials = JSON.parse(localStorage.getItem('credentials') || '{}')
  constructor() {}
  socket = io(environment.serverSocketUrl, {  query: {
      username: this.credentials.username,
      token: this.credentials.token,
    }});



  public sendMessage(message: any) {
    console.log('sendMessage: ', message);
    this.socket.emit('message', message);
  }
  public getUsers = () => {
    this.socket.on('users', (users) => {
      console.log('users1', users)
      this.users$.next(users);
    });
    // console.log('listeners', this.socket.listeners("connection"))
    // return this.socket.listeners;
    return this.users$.asObservable();
  };




  public getNewMessage = () => {
    this.socket.on('message', (message) => {
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };
}
