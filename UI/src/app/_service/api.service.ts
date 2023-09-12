import {AfterViewInit, ElementRef, Injectable, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject, of, from, fromEvent, switchMap, map} from 'rxjs';
import {io} from 'socket.io-client';
import {environment} from '@env/environment';
import {takeUntil} from "rxjs/operators";
import { HttpClient, HttpParams } from '@angular/common/http';
export interface gitUser {
  items: any,
  total_count: number

}
@Injectable({
  providedIn: 'root',
})
export class ApiService  {
  constructor(
    private http: HttpClient,
  ) {}


  public getGitUsers(data: any): Observable<Object>{
    return this.http.get(`https://api.github.com/search/users?q=${data.q}&page=${data.page}`)
  };


}
