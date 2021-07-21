import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient) {}

  createUser(user: User) {
    this.http.post(this.url + '/signup', user).subscribe((response) => {
      console.log(response);
    });
  }

  login(email: string, password: string) {}
}
