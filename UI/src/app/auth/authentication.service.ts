import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {Credentials} from '@app/_models/shell';
import {CredentialsService } from './credentials.service';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  generateToken() {
    const rand = function () {
      return Math.random().toString(36).substring(2); // remove `0.`
    };
    return rand() + rand(); // to make it longer
  }

  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    const data = {
      username: context.username,
      token: this.generateToken(),
    };
    this.credentialsService.setCredentials(data, context.remember);
    return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
