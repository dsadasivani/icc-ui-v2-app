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

  getOrders(
    offsetValue: number,
    numberOfRecords: number
  ): Observable<Orders[]> {
    const params = new HttpParams()
      .set('offset', offsetValue.toString())
      .set('numberOfRecords', numberOfRecords.toString());
    return this._http.get<Orders[]>(this.baseUrl + 'getOrders', { params });
  }

  addOrderDetails(data: any) {
    return this._http.post(this.baseUrl + 'createOrder', data);
  }
  updateOrderDetails(data: any, orderId: number) {
    return this._http.post(this.baseUrl + `updateOrder/${orderId}`, data);
  }
  getInvoiceNumbers(): Observable<number[]> {
    return this._http.get<number[]>(this.baseUrl + 'getInvoiceNumbers', {});
  }
}
