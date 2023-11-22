import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { baseUrl, getRequest } from '../utils/services';

type Message = {
    chatId: string,
    createdAt: string,
    senderId: string,
    text: string,
    _id: string,
};
type Chat = {
    members: Array<string>,
    _id: string
};

export const useFetchLatestMessage = (chat: Chat) => {

    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState<Message | null>(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

            if (response.error) {
                return console.log("Error getting messages...", response.error);
            };

            const lastMessage = response[response?.length - 1];
            setLatestMessage(lastMessage);
        };
        getMessages();
    }, [newMessage, notifications]);
    return { latestMessage };
};