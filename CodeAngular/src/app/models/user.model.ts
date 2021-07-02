import { Company } from './company.model';
import { UserType } from './user-type.model';

export class User 
{
    Id: string;
    FirstName: string;
    Surname: string;
    UserName: string;
    Role: string;
    Email: string;
    Password: string;
    Company: Company;
    UserType: UserType;
}
