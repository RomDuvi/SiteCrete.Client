import { BaseModel } from './baseModel.model';
import { SafeUrl } from '@angular/platform-browser';
import { PicturesCategories } from './picturesCategories.model';

export class Picture extends BaseModel {
    path: string;
    type: string;
    description: string;
    pictureCategories: PicturesCategories[];
    file: File;
    src: SafeUrl;
    loaded = false;
    displayName: string;
    thumbPath: string;
    thumbSrc: SafeUrl;
    width: number;
    height: number;
    price: number;
    order: number;
    discoverId: string;
}
