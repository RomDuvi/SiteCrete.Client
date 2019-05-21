import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService extends ConfigService {
    constructor(private http: HttpClient) {
        super();
    }

    login(logInfo: any) {
        return this.http.post<any>(this.config.baseUrl + this.config.userUrl + '/login', logInfo)
            .pipe(map(user => {
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    isAdminLogged(): boolean {
        if (localStorage.getItem('currentUser') === null) {
            return false;
        }
        return JSON.parse(localStorage.getItem('currentUser')).isAdmin;
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
