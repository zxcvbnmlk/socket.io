import {Component, OnInit, OnDestroy} from '@angular/core';
import {finalize, takeUntil} from 'rxjs/operators';
import { QuoteService } from './quote.service';
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
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private quoteService: QuoteService, private chatService: ChatService) {}

  ngOnInit() {
    this.messageList = new Array();
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });

    this.chatService.getNewMessage().pipe(takeUntil(this.destroy$)).subscribe((message: string) => {
      if (message) {
        this.messageList.push(message);
      }
    });
  }
  sendMessage() {
    console.log('sendMessage', this.messageList);
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
