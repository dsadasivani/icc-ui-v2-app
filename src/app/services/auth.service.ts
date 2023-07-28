import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;
  private readonly tokenKey = 'jwt_token';

  constructor(private _http: HttpClient) {}

  registerUser(payload: any): Observable<any> {
    return this._http
      .post<any>(`${this.baseUrl}auth/register`, payload)
      .pipe(tap((response) => this.storeToken(response.token)));
  }
  updateProfile(payload: any): Observable<any> {
    return this._http
      .post<any>(`${this.baseUrl}profileUpdate`, payload)
      .pipe(tap((response) => this.storeToken(response.token)));
  }

  login(payload: any): Observable<any> {
    return this._http
      .post<any>(`${this.baseUrl}auth/authenticate`, payload)
      .pipe(tap((response) => this.storeToken(response.token)));
  }
  logout(): void {
    this.removeToken();
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // You can also use HttpOnly cookie or SessionStorage
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    return Date.now() > expirationTime;
  }

  extractName(): string {
    const token = this.getToken();
    if (!token) return '';
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const lastName =
      tokenData.lastName != null && tokenData.lastName.length > 0
        ? ', ' + tokenData.lastName
        : '';
    return tokenData.firstName + lastName;
  }
  extractUserDetails(): any {
    const token = this.getToken();
    if (!token) return {};
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    let userObject = {
      firstName: tokenData.firstName,
      lastName: tokenData.lastName,
      email: tokenData.sub,
    };

    return userObject;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
