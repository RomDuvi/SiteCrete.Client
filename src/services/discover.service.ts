import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Discover } from '../models/discover.model';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService extends ConfigService {
  apiUrl: string;
  constructor(protected http: HttpClient) {
    super();
    this.apiUrl = this.config.baseUrl + this.config.discoverUrl;
  }

  addDiscover(discover: Discover): Observable<Discover> {
    return this.http.post<Discover>(this.apiUrl, discover, this.httpOptions);
  }

  getDiscovers(): Observable<Discover[]> {
    return this.http.get<Discover[]>(this.apiUrl, this.httpOptions);
  }

  updateDiscover(discover: Discover): Observable<Discover> {
    return this.http.put<Discover>(this.apiUrl, discover, this.httpOptions);
  }

  deleteDiscover(discover: Discover): Observable<Discover> {
    return this.http.post<Discover>(`${this.apiUrl}/delete`, discover, this.httpOptions);
  }
}
