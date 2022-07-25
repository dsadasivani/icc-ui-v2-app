import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Orders } from 'src/app/model/orders';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) {}

  getOrders(offsetValue: number, size: number): Observable<Orders[]> {
    const params = new HttpParams()
      .set('offset', offsetValue.toString())
      .set('numberOfRecords', size.toString());
    return this._http.get<Orders[]>(this.baseUrl + 'getOrders', { params });
  }
}
