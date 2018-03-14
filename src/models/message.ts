export enum MessageTypes {
    Information,
    Confirmation,
    Warning,
    Error
}

export class Message {
    msgType : MessageTypes= MessageTypes.Information;
    iconType = 'info';
    msg : string = '';
    title : string = 'SocialCxN';
    autoCloseAfter : number = 0;
    okBtnTitle = 'Ok';
    cancelBtnTitle = 'Cancel';
    onOkBtnClick : () => any;
    onCancelBtnClick : () => any;
}