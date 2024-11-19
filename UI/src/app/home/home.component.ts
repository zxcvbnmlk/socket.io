import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '@app/_service/chat.service';
import { Subject } from 'rxjs';
import { credentials, message, users } from '@app/_models/shell';
import { AuthenticationService } from '@app/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  quote: string | undefined;
  isLoading: boolean = false;
  users: users[] = [];
  newMessage: string | undefined;
  messageList: message[] = [];
  credentials: credentials = JSON.parse(localStorage.getItem('credentials') || '{}');
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
      .subscribe((users: users[]) => {
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
      .subscribe((message: message) => {
        if (message) {
          this.messageList.push(message);
        }
      });

    this.chatService
      .getAllMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: message[]) => {
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
