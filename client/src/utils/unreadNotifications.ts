type Notification = {
    senderId: string
    isRead: boolean,
    date: string
}

export const unreadNotificationsFuncion = (notifications: Notification[]) => {
    return notifications.filter((n) => n.isRead === false);
};