import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config/config.service';
import { Reservation } from 'src/models/reservation.model';
import { Observable } from 'rxjs';
import { LinkModel } from '../models/link.model';

@Injectable({
  providedIn: 'root'
})
export class LinkService extends ConfigService {
  apiUrl: string;
  constructor(protected http: HttpClient) {
    super();
    this.apiUrl = this.config.baseUrl + this.config.linkUrl;
  }

  addLink(link: LinkModel): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, link, this.httpOptions);
  }

  getLinks(): Observable<LinkModel[]> {
    return this.http.get<LinkModel[]>(this.apiUrl, this.httpOptions);
  }

  updateLink(link: LinkModel): Observable<LinkModel> {
    return this.http.put<LinkModel>(this.apiUrl, link, this.httpOptions);
  }

  deleteLink(link: LinkModel): Observable<LinkModel> {
    return this.http.post<LinkModel>(`${this.apiUrl}/delete`, link, this.httpOptions);
  }
}
