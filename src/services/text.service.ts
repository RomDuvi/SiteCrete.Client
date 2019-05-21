import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { HttpClient } from '@angular/common/http';
import { TextModel } from '../models/text.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TextService extends ConfigService {
    apiUrl: string;
    constructor(protected http: HttpClient) {
        super();
        this.apiUrl = this.config.baseUrl + this.config.textUrl;
    }

    getText(textId: string, lang: string): Observable<string> {
        return this.http.get<string>(`${this.apiUrl}/${textId}/${lang}`, {responseType: 'text' as 'json'});
    }

    saveText(text: TextModel): Observable<string> {
        return this.http.post<string>(this.apiUrl, text, {responseType: 'text' as 'json'});
    }
}
