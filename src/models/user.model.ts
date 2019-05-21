import { BaseModel } from './baseModel.model';
export class User extends BaseModel {
    username: string;
    password: string;
    displayName: string;
    email: string;
    isAdmin: boolean;

    constructor() {
            super();
         }
}
