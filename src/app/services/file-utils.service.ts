import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUtilsService {
  baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) {}

  getFileContent(orderId: number): Observable<Blob> {
    return this._http.get(this.baseUrl + 'generateInvoiceById/' + orderId, {
      responseType: 'blob',
    });
  }
}
