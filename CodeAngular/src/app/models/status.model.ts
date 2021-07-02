export class Status 
{
    Id: number;
    Name: string;
    
    constructor(statusId: number, statusName: string) 
    {    
        this.Id = statusId;
        this.Name = statusName;
    }
}
