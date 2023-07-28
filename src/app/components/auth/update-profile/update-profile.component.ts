import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  userDetails: any = {};
  profileUpdateForm: FormGroup = new FormGroup({});
  hidePassword: boolean = true;

  ngOnInit(): void {
    this.profileUpdateForm
      .get('confirmPassword')
      ?.valueChanges.subscribe(() => {
        this.comparePasswords();
        this.profileUpdateForm.updateValueAndValidity();
      });
    this.userDetails = this.authService.extractUserDetails();
    this.profileUpdateForm = new FormGroup({
      firstName: new FormControl(this.userDetails.firstName),
      lastName: new FormControl(this.userDetails.lastName),
      email: new FormControl(this.userDetails.email),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
  }

  onSubmit() {
    if (this.profileUpdateForm.valid) {
      const payload = {
        firstName: this.profileUpdateForm.get('firstName')?.value,
        lastName: this.profileUpdateForm.get('lastName')?.value,
        email: this.userDetails.email,
        password: this.profileUpdateForm.get('password')?.value,
      };
      this.authService.updateProfile(payload).subscribe({
        next: (result: any) => {
          if (result.status == 'SUCCESS') {
            this._snackBar.open(
              'User profile updated successfully.',
              'Dismiss',
              {
                duration: 3000,
              }
            );
            this.profileUpdateForm.get('password')?.reset();
            this.profileUpdateForm.get('confirmPassword')?.reset();
          }
        },
        error: (result: any) => {
          console.log('error -> ', result);
          this._snackBar.open(result.error.errorMsg, 'Dismiss', {
            duration: 3000,
          });
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  comparePasswords() {
    const password = this.profileUpdateForm.get('password')?.value;
    const confirmPassword =
      this.profileUpdateForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.profileUpdateForm
        .get('confirmPassword')
        ?.setErrors({ mismatch: true });
    }
  }
}
