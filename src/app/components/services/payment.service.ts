import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://your-backend-url/api/payment';

  constructor(private http: HttpClient) { }

  createPayment(paymentDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-payment`, paymentDetails);
  }
}
