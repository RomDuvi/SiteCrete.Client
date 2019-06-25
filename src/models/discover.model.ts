import { BaseModel } from './baseModel.model';
import { Picture } from 'src/models/picture.model';
export class Discover extends BaseModel {
    title: string;
    distancte: string;
    duration: string;
    distanceDuration: string;
    descriptionFr: string;
    descriptionEn: string;
    umapUrlFr: string;
    umapUrlEn: string;
    picture: Picture;
    pictures: Picture[];
}