import { BaseModel } from './baseModel.model';
import { SafeUrl } from '@angular/platform-browser';

export class Picture extends BaseModel {
    path: string;
    type: string;
    description: string;
    categoryId: string;
    file: File;
    loaded = false;
    displayName: string;
    thumbPath: string;
    width: number;
    height: number;
    order: number;
    discoverId: string;

    pictureSrc: SafeUrl;
    thumbSrc: SafeUrl;
}
