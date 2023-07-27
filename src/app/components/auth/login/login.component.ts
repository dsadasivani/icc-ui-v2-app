import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}
  hidePassword: boolean = true;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (result: any) => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (error: any) => {
          console.log('error -> ', error);
          let msg = 'Error while logging into account';
          if (
            error.status == 404 &&
            error.error.error === 'Invalid Credentials'
          ) {
            msg = 'Invalid Username or password';
          }
          this._snackBar.open(msg, 'Dismiss', {
            duration: 3000,
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  navigateToRegisterScreen() {
    this.router.navigateByUrl('/auth/register');
  }
}
