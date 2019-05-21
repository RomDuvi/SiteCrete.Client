import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config/config.service';
import { Reservation } from 'src/models/reservation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends ConfigService{
  apiUrl: string;
  constructor(protected http: HttpClient) {
    super();
    this.apiUrl = this.config.baseUrl + this.config.reservationUrl;
  }

  addReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation, this.httpOptions);
  }

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, this.httpOptions);
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(this.apiUrl, reservation, this.httpOptions);
  }

  deleteReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/delete`, reservation, this.httpOptions);
  }
}
