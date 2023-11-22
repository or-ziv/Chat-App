import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";



export default function Chat() {

    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);




    return (
        <Container>
            <PotentialChats />
            {userChats!?.length < 1 ? null :
                <Stack className="align-items-start" direction="horizontal" gap={4}>
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => {
                                    if (updateCurrentChat && chat) { updateCurrentChat(chat) }
                                }}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </Stack>
                    <Stack>
                        <ChatBox />
                    </Stack>
                </Stack>}
        </Container>
    )
};
