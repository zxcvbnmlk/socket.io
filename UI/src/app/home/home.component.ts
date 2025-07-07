import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '@app/_service/chat.service';
import { Subject } from 'rxjs';
import { Credentials, Message, Users } from '@app/_models/shell';
import { AuthenticationService } from '@app/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  users: Users[] = [];
  newMessage: string | undefined;
  messageList: Message[] = [];
  credentials: Credentials = JSON.parse(localStorage.getItem('credentials') || '{}');
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.connect();
    this.chatService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: Users[]) => {
        if (!users.find((item) => item.token === this.credentials.token)) {
          this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
        }
        if (users) {
          this.users = users;
        }
      });
    this.chatService
      .getNewMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: Message) => {
        if (message) {
          this.messageList.push(message);
        }
      });

    this.chatService
      .getAllMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: Message[]) => {
        this.messageList = messages;
      });
  }

  sendMessage() {
    if (!this.newMessage) return;
    this.chatService.sendMessage(this.newMessage);
    delete this.newMessage;
  }
  disconnect() {
    this.chatService.disconnect();
  }
  connect() {
    this.chatService.connect();
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
