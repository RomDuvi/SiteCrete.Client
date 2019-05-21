import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/internal/Subject';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements OnInit {

    public onClose: Subject<boolean>;

    @Input() message: string;
    constructor(public bsModalRef: BsModalRef) {
    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    public decline() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }

    public accept() {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

}
