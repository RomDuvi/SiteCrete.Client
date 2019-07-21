import { BaseModel } from './baseModel.model';
import { SafeUrl } from '@angular/platform-browser';

export class Category extends BaseModel {
    id: string;
    name: string;
    description: string;
    src: SafeUrl;
    file: File;
    fileType: string;
    path: string;
    loaded: boolean;
}
