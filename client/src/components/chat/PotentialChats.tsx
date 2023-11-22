import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

export default function PotentialChats() {

    const { user } = useContext(AuthContext)
    const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

    return (
        <>
            <div className="all-users">
                {potentialChats && potentialChats?.map((u: User, index) => {
                    return (
                        <div className="single-user" key={index} onClick={() => {
                            if (user && u._id) {
                                createChat!(user._id, u._id);
                            }
                        }}>
                            {u?.name}
                            <span className={
                                onlineUsers?.some((user) => user.userId === u._id)
                                    ? "user-online"
                                    : ""}
                            ></span>
                        </div>
                    )
                })}
            </div >
        </>
    );
};
