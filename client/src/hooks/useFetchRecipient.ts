import { useState, useEffect } from 'react';
import { baseUrl, getRequest } from '../utils/services';

type Chat = {
    members: Array<string>
}

type RecipientUser = {
    createdAt: string,
    email: string,
    name: string,
    _id: string
}


export const useFetchRecipientUser = (chat: Chat, user: User) => {
    const [recipientUser, setRecipientUser] = useState<RecipientUser | null>(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find((id) => id !== user?._id)

    useEffect(() => {
        const getUser = async () => {

            if (!recipientId) return null;

            const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

            if (response.error) {
                return setError(error);
            };


            setRecipientUser(response);
        }
        getUser();
    }, [recipientId]);
    return { recipientUser }
};

