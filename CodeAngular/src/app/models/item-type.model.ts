export class ItemType 
{
    Id: number;
    Name: string;
    
    constructor(itemTypeId: number, itemTypeName: string)
    {
        this.Id = itemTypeId;
        this.Name = itemTypeName;
    }
}
