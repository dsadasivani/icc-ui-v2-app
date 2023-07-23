import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  username: string | undefined;
  password: string | undefined;
  hidePassword: boolean = true;

  onSubmit() {}
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
