import { BaseModel } from './baseModel.model';

export class Reservation extends BaseModel {
    name: string;
    from: Date;
    to: Date;
    type: ReservationType;
    isNew: boolean;
}

export class ReservationModel extends BaseModel {
    name: string;
    from: string;
    to: string;
    type: ReservationType;
    isNew: boolean;
}

export enum ReservationType {
    EntireVilla = 0,
    Upstairs = 1,
    Downstairs = 2
}

export class SelectedDate {
    startStr: string;
    endStr: string;
}
