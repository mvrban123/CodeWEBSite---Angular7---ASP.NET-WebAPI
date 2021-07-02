export class UserType 
{
    Id: number;
    Name: string;

    constructor(public userTypeId: number, public userTypeName: string)
    {
        this.Id = userTypeId;
        this.Name = userTypeName;
    }

}
