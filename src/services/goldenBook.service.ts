import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';
import { GoldComment } from '../models/goldComment';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoldenBookService extends ConfigService {
  apiUrl: string;
  constructor(protected http: HttpClient) {
    super();
    this.apiUrl = this.config.baseUrl + this.config.goldenCommentUrl;
  }

  addComment(comment: GoldComment): Observable<GoldComment> {
    return this.http.post<GoldComment>(this.apiUrl, comment, this.httpOptions);
  }

  getComments(): Observable<GoldComment[]> {
    return this.http.get<GoldComment[]>(this.apiUrl, this.httpOptions);
  }

  updateComment(comment: GoldComment): Observable<GoldComment> {
    return this.http.put<GoldComment>(this.apiUrl, comment, this.httpOptions);
  }

  deleteComment(comment: GoldComment): Observable<GoldComment> {
    return this.http.post<GoldComment>(`${this.apiUrl}/delete`, comment, this.httpOptions);
  }
}
