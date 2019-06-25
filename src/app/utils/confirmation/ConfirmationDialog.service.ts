import { Injectable } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';


@Injectable()
export class ConfirmationDialogService {
    bsModalRef: BsModalRef;
    constructor(private modalService: BsModalService) { }

    public confirm(message: string) {
        // object passed to component 'ConfirmationComponent' can be added more elements
        const initialState = {
            message: message
        };

        this.bsModalRef = this.modalService.show(ConfirmationDialogComponent, { initialState });

        return this.bsModalRef.content.onClose;
    }

}
