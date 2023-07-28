import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  hidePassword: boolean = true;

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value).subscribe({
        next: (result: any) => {
          this._snackBar.open('User account created successfully.', 'Dismiss', {
            duration: 3000,
          });
          this.router.navigateByUrl('/dashboard');
        },
        error: (result: any) => {
          console.log('error -> ', result);
          this._snackBar.open(result.error.errorMsg, 'Dismiss', {
            duration: 3000,
          });
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
