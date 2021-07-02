import { Item } from './item.model';
import { User } from './user.model';

export class Order 
{
    Id: number;
    UserId: string;
    User: User;
    StatusId: number;
    OrderDate: Date;
    Delivery: boolean;
    InvoiceLocation: string;
    WarrantyLocation: string;
    OrderItems: OrderItem[];
}

export class OrderItem
{
    Id: number;
    OrderId: number;
    ItemId: number;
    Item: Item;
    Amount: number;
}