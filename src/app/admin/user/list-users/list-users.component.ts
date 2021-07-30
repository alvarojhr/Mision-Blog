import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css'],
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  userSub: Subscription;
  displayedColumns: string[] = ['id', 'name', 'email'];

  constructor(public userService: UserService) {
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  ngOnInit(): void {
    this.userService.getUsers();
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }
}
