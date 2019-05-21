import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastGeneratorService } from '../toastGenerator.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(
        private toast: ToastGeneratorService
    ) { }
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const r = req;
        return next.handle(req)
                .pipe(tap(
                    (event: HttpEvent<any>) => {},
                    (err: any) => {
                        if (err instanceof HttpErrorResponse) {
                            this.handleError(err);
                        } else {
                            return Observable.throw(err || ' Unhandled error');
                        }
                    }
                ));
    }

    private handleError(err: HttpErrorResponse) {
        switch (err.status) {
            case 400:
                this.toast.toastError('Bad request', err.message);
                break;
            case 401:
                break;
            case 500:
                console.log('500', err);
                this.toast.toastError('Server error', err.message);
                break;
            default:
                this.toast.toastError('Server error', err.message);
                break;

        }
    }
}
