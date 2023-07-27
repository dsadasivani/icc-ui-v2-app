import { Component, OnInit } from '@angular/core';
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
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (result: any) => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (error: any) => {
        console.log('error -> ', error);
        this._snackBar.open(
          'Error while fetching Transport details',
          'Dismiss',
          {
            duration: 3000,
            panelClass: 'error-snackbar',
          }
        );
      },
    });
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  navigateToRegisterScreen() {
    this.router.navigateByUrl('/auth/register');
  }
}
