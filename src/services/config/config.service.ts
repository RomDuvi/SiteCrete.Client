import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { config } from '../../environments/environment';
import { Config } from '../../models/config.model';
@Injectable()
export class ConfigService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
  };

  get config(): Config { return config; }

  getValueByKey(key: string): string {
    return config[key];
  }

  constructor() {

  }
}
