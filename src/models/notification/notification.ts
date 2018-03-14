import { NotificationArray } from "./notification.array";

export class Notifications {
    offsetValue: number;
    limitValue: number;
    notification: {
        totalNotifications: number;
        totalUnread: number;
        all : Array<NotificationArray>;
    }
    
}