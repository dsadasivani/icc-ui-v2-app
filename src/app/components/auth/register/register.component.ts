import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  onSubmit() {
    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };
    this.authService.registerUser(payload).subscribe({
      next: (result: any) => {
        this.router.navigateByUrl('/dashboard');
      },
      error: (error: any) => {
        console.log('error -> ', error);
        this._snackBar.open('Error while creating user', 'Dismiss', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
