import { BaseModel } from './baseModel.model';

export class Reservation extends BaseModel {
    name: string;
    from: Date;
    to: Date;
    type: ReservationType;
    isNew: boolean;
}

export enum ReservationType {
    EntireVilla = 0,
    Upstairs = 1,
    Downstairs1 = 2,
    Downstairs2 = 3
}

export class SelectedDate {
    startStr: string;
    endStr: string;
}
