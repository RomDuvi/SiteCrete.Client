import { BaseModel } from './baseModel.model';
export class GoldComment extends BaseModel {
    name: string;
    comment: string;
    stayStartDate: Date;
    stayEndDate: Date;
    evaluation: number;
    answer: string;
}
