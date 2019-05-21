import { ToastrService } from 'ngx-toastr';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class ToastGeneratorService implements OnInit {
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  public toastError(title: string, message: string): void {
    this.toastr.error(message, title);
  }

  public toastWarning(title: string, message: string): void {
    this.toastr.warning(message, title);
  }

  public toastSucess(title: string, message: string): void {
    this.toastr.success(message, title);
  }
}
