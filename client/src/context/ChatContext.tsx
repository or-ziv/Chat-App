import { createContext, useState, ReactNode, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/services';
import { io, Socket } from 'socket.io-client';

type ChatContextProviderProps = {
    children: ReactNode,
    user: User | null | undefined
};

declare global {
    type User = {
        name: string,
        email: string,
        password: string,
        _id?: string
    }
};

type Chat = {
    members: Array<string>,
    _id: string
};

type Message = {
    chatId: string,
    createdAt: string,
    senderId: string,
    text: string,
    _id: string,
};

type Notification = {
    senderId: string
    isRead: boolean,
    date: string
}

type OnlineUser = {
    socketId: string,
    userId: string
};

type ChatContextType = {
    userChats?: Chat[] | null,
    userChatsError?: Error | null,
    isUserChatsLoading?: boolean,
    potentialChats?: User[],
    createChat?: (firstId: string, secondId: string) => void,
    updateCurrentChat?: (chat: Chat) => void,
    currentChat?: Chat | null,
    messages?: Message[] | null,
    isMessagesLoading?: boolean,
    messagesError?: Error | null,
    setTextMessage?: Dispatch<SetStateAction<string>>,
    textMessage?: string
    sendTextMessage?: (textMessage: string, sender: User, currentChatId: string) => void,
    onlineUsers?: OnlineUser[],
    notifications?: Notification[],
    allUsers?: User[],
    markAllNotificationsAsRead?: (notifications: Notification[]) => void,
    markNotificationAsRead?: (userChats: Chat[], user: User, notifications: Notification[], n: Notification) => void,
    markThisUserNotificationsAsRead?: (thisUserNotifications: Notification[], notifications: Notification[]) => void,
    newMessage?: object | null,

};



export const ChatContext = createContext<ChatContextType>({});

export const ChatContextProvider = ({ children, user }: ChatContextProviderProps) => {

    const [userChats, setUserChats] = useState<Chat[]>([]);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);

    const [potentialChats, setPotentialChats] = useState<[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);

    const [messages, setMessages] = useState<Message[]>([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)

    const [textMessage, setTextMessage] = useState('');
    const [textMessageError, setTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState<object | null>(null);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);






    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect()
        }
    }, [user]);


    // Add online users
    useEffect(() => {
        if (socket === null) return;
        socket?.emit("addNewUser", (user?._id));
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    // Send message
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members.find((id: string) => id !== user?._id);
        socket.emit("sendMessage", { ...newMessage, recipientId });

    }, [newMessage]);

    // Receive message & notification
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        });

        socket.on("getNotification", (res) => {
            const isChatOpen = currentChat?.members.some(id => id === res.senderId);

            if (isChatOpen) {
                setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            }
            else {
                setNotifications((prev) => [res, ...prev]);
            }
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };

    }, [socket, currentChat]);


    useEffect(() => {
        const getUsers = async () => {

            const response = await getRequest(`${baseUrl}/users`);
            if (response.error) {
                return console.log(response);
            }
            const pChats = response.filter((u: User) => {
                let isChatCreated = false;

                if (user?._id === u._id) return false;

                if (userChats) {
                    isChatCreated = userChats.some((chat: Chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                };
                return !isChatCreated;
            });
            setPotentialChats(pChats);
            setAllUsers(response)
        };
        getUsers();
    }, [userChats]);



    useEffect(() => {
        const getUSerChats = async () => {

            if (user?._id) {

                setIsUserChatsLoading(true)
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                setIsUserChatsLoading(false)

                if (response.error) {
                    return setUserChatsError(response);
                }
                setUserChats(response);
            }
        }
        getUSerChats();
    }, [user, notifications]);


    useEffect(() => {
        const getMessages = async () => {

            setIsMessagesLoading(true)
            setMessagesError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            setIsMessagesLoading(false)

            if (response.error) {
                return setMessagesError(response);
            }
            setMessages(response);

        }
        getMessages();
    }, [currentChat]);


    const sendTextMessage = useCallback(async (textMessage: string, sender: User, currentChatId: string) => {

        if (!textMessage) return console.log(`Can't submit an empty text...`);

        const response = await postRequest(`${baseUrl}/messages`,
            ({
                chatId: currentChatId,
                senderId: sender._id,
                text: textMessage
            }));

        if (response.error) {
            return setTextMessageError(response);
        }
        setNewMessage(response);
        setMessages((prev) => [...prev, response])
        setTextMessage('');
    }, []);


    const updateCurrentChat = useCallback((chat: Chat) => {
        setCurrentChat(chat)
    }, []);


    const createChat = useCallback(async (firstId: string, secondId: string) => {
        const response = await postRequest(`${baseUrl}/chats`, ({ firstId, secondId }));

        if (response.error) {
            return console.log("Error creating chat", response);
        };

        setUserChats((prev) => [...prev, response]);
    }, []);

    const markAllNotificationsAsRead = useCallback((notifications: Notification[]) => {
        const mNotifications = notifications.map((n) => { return { ...n, isRead: true } });
        setNotifications(mNotifications);
    }, []);

    const markNotificationAsRead = useCallback((userChats: Chat[], user: User, notifications: Notification[], n: Notification) => {
        // find chat to open
        const desiredChat = userChats.find(chat => {
            const chatMembers = [user._id, n.senderId];
            const isDesiredChat = chat?.members.every((member) => {
                return chatMembers.includes(member)
            });
            return isDesiredChat;
        });
        // mark notification as read
        const mNotifications = notifications.map((el) => {
            if (n.senderId === el.senderId) {
                return { ...n, isRead: true }
            }
            else {
                return el;
            }
        });
        if (desiredChat) updateCurrentChat(desiredChat);
        setNotifications(mNotifications);
    }, []);

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications: Notification[], notifications: Notification[]) => {
        // mark notification as read
        const mNotifications = notifications.map((el) => {
            let notification = el;

            thisUserNotifications.forEach((n) => {
                if (n.senderId === el.senderId) {
                    notification = { ...n, isRead: true };
                }
                else {
                    notification = el;
                };
            });
            return notification;
        });
        setNotifications(mNotifications);

    }, [])

    return <ChatContext.Provider value={{

        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        currentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        setTextMessage,
        textMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        newMessage,

    }}>
        {children}
    </ChatContext.Provider>
}
