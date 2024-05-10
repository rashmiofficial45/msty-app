export interface Message{
    content:string
    created_at:Date
}
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>;
}