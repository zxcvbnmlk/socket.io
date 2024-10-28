import {Component, OnInit, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import { ChatService } from '@app/_service/chat.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading = false;
  users: any;
  newMessage: any;
  socket: any;
  messageList: any = [];
  credentials: any;
  private destroy$: Subject<void> = new Subject<void>();



  constructor(
    private chatService: ChatService,
  ) {

  }

  ngOnInit() {
    this.credentials = this.chatService.credentials
    this.messageList = [];
    this.connect();
    this.chatService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: string) => {
        if (users) {
          this.users = users;
        }
      });

    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: any) => {
        if (message) {
          this.messageList.push(message);
        }
      });

    this.chatService
      .getAllMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: any) => {
        this.messageList = messages;
      });


  }



  sendMessage() {
    if (this.newMessage === '') return;
    this.chatService
      .sendMessage(this.newMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
    this.newMessage = '';
  }
  disconnect() {
    this.chatService
      .disconnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }
  connect() {
    this.chatService
      .connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
