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

  login(username: string, password: string): Observable<any> {
    const loginData = { email: username, password: password };
    return this._http
      .post<any>(`${this.baseUrl}auth/authenticate`, loginData)
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
    if (!token) return 'Guest';
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.firstName + ', ' + tokenData.lastName;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }
}
