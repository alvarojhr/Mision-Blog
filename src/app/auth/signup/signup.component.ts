import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  user: User;

  constructor(public authService: AuthService) {
    this.user = { id: '', name: '', email: '', password: '' };
  }

  ngOnInit(): void {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value);
  }
}
