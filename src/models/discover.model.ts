import { BaseModel } from './baseModel.model';
import { Picture } from 'src/models/picture.model';
import { SafeUrl } from '@angular/platform-browser';
export class Discover extends BaseModel {
    titleFr: string;
    titleEn: string;
    distancte: string;
    duration: string;
    distanceDuration: string;
    descriptionFr: string;
    descriptionEn: string;
    umapUrlFr: string;
    umapUrlEn: string;
    picture: Picture;
    pictures: Picture[];
    safeUrl: SafeUrl;
}
