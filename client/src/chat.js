import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages, sendChatMessage } from "./action";
import { emitSingleMessage } from "./socket";

export default function Chat() {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const dispatch = useDispatch();
    let messages = useSelector((store) => store.chat);
    useEffect(() => {
        console.log("chatRef:", chatRef);
        // console.log("loading of Chat");
        dispatch(receiveChatMessages());
    }, [chatRef]);

    if (!messages) return null;

    const submit = function () {
        setValue(null);
        input.current.value = null;
        input.current.focus();
        emitSingleMessage(value);
    };

    // console.log("Messages:", messages[0]);

    // console.log(chat.current.scrollTop);
    // console.log(chat.current.scrollHeight);
    // console.log(chat.current.clientHeight);
    return (
        <div className="chat">
            <div className="chat-container">
                <div
                    ref={chatRef}
                    className="messages"
                    onLoad={() => {
                        chatRef.current.scrollTop =
                            chatRef.current.scrollHeight -
                            chatRef.current.clientHeight;
                    }}
                >
                    {messages.map((msg, i) => (
                        <div className="message" key={i}>
                            <div className="chat-image">
                                <img src={msg.profile_pic_url} />
                            </div>
                            <div className="chat-right">
                                <div className="chat-head">
                                    <h5>
                                        {msg.first} {msg.last}
                                    </h5>
                                    <p>
                                        {new Date(
                                            msg.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="chat-body">
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="new-message">
                    <textarea
                        ref={input}
                        defaultValue={value}
                        className="chat-input"
                        onKeyDown={(e) => {
                            if (e.keyCode == 13) {
                                if (value) {
                                    submit();
                                }
                            }
                        }}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                    />
                    <button disabled={!value} onClick={submit}>
                        Publish Message
                    </button>
                </div>
            </div>
        </div>
    );
}
