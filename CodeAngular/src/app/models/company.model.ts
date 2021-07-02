import { User } from './user.model';

export class Company 
{
    Id: number;
    UserId: string;
    User: User;
    Name: string;
    Address: string;
    City: string;
    PostalNumber: string;
    Oib: string;
}
