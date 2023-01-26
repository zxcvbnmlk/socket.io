import { Observable, of } from 'rxjs';

import { LoginContext } from './authentication.service';
import { Credentials } from './credentials.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    username: 'test',
    token: '123',
  };
  generateToken() {
    const rand = function() {
      return Math.random().toString(36).substring(2); // remove `0.`
    };
    return rand() + rand(); // to make it longer
  }
  login(context: LoginContext): Observable<Credentials> {
    return of({
      username: context.username,
      token: this.generateToken(),
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }
}
