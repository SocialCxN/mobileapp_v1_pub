export class NotificationArray {
    id: number;
    pageUrl: string;
    fanCount: number;

    deviceType: string;
    readStatus: number;
    event: string;
    relatedTo: string;
    body: string;
    webUrl: string;
    mobilePage: string;
    parentId: number;
    date: string;
    sender: {
        id: number;
        loginEmail: string;
        firstName: string;
        lastName: string;
        entity: {
            id: number;
            entityName: string;
            entityType: string;
            profilePic: {}
        }
    }
}