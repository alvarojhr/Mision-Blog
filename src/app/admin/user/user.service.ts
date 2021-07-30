import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:3000/api/user';
  users: User[] = [];
  usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http
      .get<any>(this.url)
      .pipe(
        map((usersData) => {
          return usersData.map(
            (user: { _id: string; username: string; email: string }) => {
              return {
                id: user._id,
                name: user.username,
                email: user.email,
              };
            }
          );
        })
      )
      .subscribe((dataTransformed) => {
        console.log(dataTransformed);
        this.users = dataTransformed;
        this.usersUpdated.next([...this.users]);
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
}
