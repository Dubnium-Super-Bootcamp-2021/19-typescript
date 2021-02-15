export interface WorkerInterface{
    id:number;
    name:string;
    age:number;
    bio:string;
    address:string;
    photo:string;
  }
  
export interface TaskInterface{
id:number;
job:string;
done:boolean;
cancelled:boolean;
addedAt:string;
attachment:string;
assignee:WorkerInterface;
}