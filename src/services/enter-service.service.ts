import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnterServiceService {
  public entered: boolean;

  constructor() { }

  public enter() {
    this.entered = true;
  }

  public isEntered() {
    return this.entered;
  }
}
