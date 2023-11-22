import { useContext } from "react";
import avatarPic from '../../assets/avatar.svg'
import { Stack } from 'react-bootstrap';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFuncion } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLastMessae";
import moment from "moment";

type UserChatProps = {
    chat: Chat,
    user: User | null | undefined,
}

type Chat = {
    members: Array<string>,
    _id: string
};


export default function UserChat(props: UserChatProps) {

    const { recipientUser } = useFetchRecipientUser(props.chat, props.user!);
    const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);


    const unreadNotifications = notifications ? unreadNotificationsFuncion(notifications) : undefined;
    const thisUserNotifications = unreadNotifications?.filter((n) => (
        n.senderId === recipientUser?._id
    ));

    const { latestMessage } = useFetchLatestMessage(props.chat);
    const isOnline = onlineUsers?.some((user) => user.userId === recipientUser?._id);

    const truncateText = (text: string) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        };
        return shortText;
    };

    return (
        <Stack
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            direction="horizontal"
            gap={3}
            onClick={() => {
                if (thisUserNotifications?.length !== 0) {
                    if (markThisUserNotificationsAsRead && thisUserNotifications && notifications)
                        markThisUserNotificationsAsRead(thisUserNotifications, notifications)
                }
            }}
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatarPic} height='35px' />
                    <div className="text-content">
                    </div>
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">{latestMessage?.text && (
                        <span>{truncateText(latestMessage?.text)}</span>
                    )}
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">{moment(latestMessage?.createdAt).calendar()}</div>
                <div className={thisUserNotifications?.length ?? 0 > 0 ? "this-user-notifications" : ""}>
                    {thisUserNotifications?.length ?? 0 > 0 ? thisUserNotifications?.length : ""}
                </div>
                <div className={isOnline ? "user-online" : ""}></div>
            </div>
        </Stack>
    )
}
