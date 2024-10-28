import { AfterViewInit, ElementRef, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, of, from, fromEvent, switchMap, map, tap } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public credentials = JSON.parse(localStorage.getItem('credentials') || '{}');

  constructor() {}

  socket$ = of(
    io(environment.serverSocketUrl, {
      query: {
        username: this.credentials.username,
        token: this.credentials.token,
      },
    })
  );

  public sendMessage(message: any) {
    return this.socket$.pipe(
      map((socket) => {
        socket.emit('message', message);
      })
    );
  }

  public getUsers = () => {
    return this.socket$.pipe(
      switchMap((socket) => {
        return fromEvent(socket, 'users').pipe(map((users) => users));
      })
    );
  };

  public getNewMessage = () => {
    return this.socket$.pipe(switchMap((socket) => fromEvent(socket, 'message').pipe(map((message) => message))));
  };

  public getAllMessages = () => {
    return this.socket$.pipe(switchMap((socket) => fromEvent(socket, 'messageAll').pipe(map((messages) => messages))));
  };
  public disconnect = () => {
    return this.socket$.pipe(
      map((socket) => {
        socket.disconnect();
      })
    );
  };
  public connect = () => {
    return this.socket$.pipe(
      map((socket) => {
        socket.connect();
      })
    );
  };
}
