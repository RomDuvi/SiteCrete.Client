import { BaseModel } from './baseModel.model';
import { PicturesCategories } from './picturesCategories.model';
import { SafeUrl } from '@angular/platform-browser';

export class Category extends BaseModel {
    name: string;
    description: string;
    pictureCategories: PicturesCategories[];
    src: SafeUrl;
    file: File;
    fileType: string;
    path: string;
    loaded: boolean;
}
