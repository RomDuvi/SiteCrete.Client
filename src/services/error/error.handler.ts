import { ErrorHandler } from '@angular/core';

class AppErrorHandler implements ErrorHandler {
    handleError(error: any) {
        console.log(error);
    }
}
