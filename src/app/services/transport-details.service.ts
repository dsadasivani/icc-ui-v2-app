import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransportDetailsService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) {}

  getTransportDetails(): Observable<any[]> {
    return this._http.get<any[]>(this.baseUrl + 'getTransportDetails', {});
  }
}
