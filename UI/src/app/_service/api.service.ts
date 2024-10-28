import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_GITHUB_TOKEN } from '@app/app.module';
import { HttpClient } from '@angular/common/http';
import { ApiGitHub } from '@app/_models/shell';
export interface gitUser {
  items: any;
  total_count: number;
}
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, @Inject(API_GITHUB_TOKEN) private ApiGitHub: ApiGitHub) {}

  public getGitUsers(data: any): Observable<Object> {
    return this.http.get(`${this.ApiGitHub}search/users?q=${data.q}&page=${data.page}`);
  }
}
