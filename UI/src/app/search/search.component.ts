import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { environment } from '@env/environment';
import {EMPTY, fromEvent, Observable, Subject} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {ApiService} from "@app/_service/api.service";

export interface gitUser {
  items: any[],
  total_count: number
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('search',{static:true}) searchInput: any
  @ViewChild('gitUsersBox',{static:true}) gitUsersBox: any
  version: string | null = environment.version;
  gitUsers: any = [];
  err: string | null = null
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private apiService: ApiService) {}
  private page = 1;
  private searchText: string = '';
  ngOnInit() {
    this.searchGo()
    this.scrollAdd()
  }

  searchGo() {
    const stream$: Observable<any> = fromEvent(this.searchInput.nativeElement, 'input')

    stream$.pipe(
      map((e) => {
        return e.target.value}),
      debounceTime(1000),
      distinctUntilChanged(),
      tap( e => {if (e.length >= 0){
        this.searchText = e;
        this.gitUsers = [];
        this.err = null
      }}),
      filter(e  => e.trim()),
      switchMap( e =>  this.apiService.getGitUsers({q:this.searchText,page:this.page}).pipe(
        catchError(err => {
          this.err = err.error.message;
          return EMPTY; // for go next after error
        })
      )),
      takeUntil(this.destroy$)
    ).subscribe( values => {
      this.gitUsers = values;
    })
  }



  scrollAdd() {
    const stream$: Observable<any> = fromEvent(this.gitUsersBox.nativeElement, 'scroll', { capture: true })
    stream$.pipe(
        debounceTime(1000),
        map( e => {
          return e.target.scrollHeight < e.target.scrollTop+e.target.offsetHeight ? 'atBottom' : ''
        }),
        filter(e => e==='atBottom'),
        switchMap( e =>  this.apiService.getGitUsers({q:this.searchText,page:this.page + 1}).pipe(
          catchError(err => {
            this.err = err.error.message;
            return EMPTY; // for go next after error
          })
        )),

      )
      .subscribe((values:any ) => {
        values.items.forEach( (item:any) => this.gitUsers.items.push(item))
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
