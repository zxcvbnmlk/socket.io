import {AfterViewInit, ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, of, from, fromEvent, switchMap, map} from 'rxjs';
import {io} from 'socket.io-client';
import {environment} from '@env/environment';
import {takeUntil} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  public credentials = JSON.parse(localStorage.getItem('credentials') || '{}')
  private destroy$: Subject<void> = new Subject<void>();
  constructor() {}

  socket$ = of(io(environment.serverSocketUrl, {
    query: {
      username: this.credentials.username,
      token: this.credentials.token,
    }
  }));

  public sendMessage(message: any) {
    this.socket$
      .pipe(takeUntil(this.destroy$))
      .subscribe((socket) => {
      socket.emit('message', message)
    })
  }

  public getUsers = () => {
   return  this.socket$.pipe(
     switchMap(socket =>
       fromEvent(socket, 'users').pipe(
         map(users => (users))
       )
     )
   )
  };


  public getNewMessage = () => {
    return  this.socket$.pipe(
      switchMap(socket =>
        fromEvent(socket, 'message').pipe(
          map(message => (message))
        )
      )
    )
  };

  public getAllMessages = () => {
    return  this.socket$.pipe(
      switchMap(socket =>
        fromEvent(socket, 'messageAll').pipe(
          map(messages => (messages))
        )
      )
    )
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
