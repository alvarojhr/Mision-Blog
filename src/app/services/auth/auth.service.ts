import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PostService } from '../post/post.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  url = 'http://localhost:3000/api/user';
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
    this.token = '';
  }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(user: User) {
    this.http.post(this.url + '/signup', user).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {
    this.http
      .post<{ token: string; expiresIn: number }>(this.url + '/login', {
        email,
        password,
      })
      .subscribe((response) => {
        this.token = response.token;
        if (this.token) {
          const expirationInDuration = response.expiresIn;
          this.setAuthTimer(expirationInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expirationInDuration * 1000
          );
          console.log(expirationDate);
          this.saveAuthData(this.token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expiration')!);
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: expirationDate,
    };
  }

  private setAuthTimer(duration: number) {
    setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = localStorage.getItem('token')!;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
}
