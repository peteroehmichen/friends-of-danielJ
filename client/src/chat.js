import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages } from "./action";
import { format_time } from "./helpers";
import { emitSingleMessage } from "./socket";

export default function Chat() {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const dispatch = useDispatch();
    const messages = useSelector((store) => store.chat);

    useEffect(() => {
        if (messages) {
            chatRef.current.scrollTop =
                chatRef.current.scrollHeight - chatRef.current.clientHeight;
        }
        dispatch(receiveChatMessages());
    }, [messages]);

    const submit = function (e) {
        setValue(null);
        // console.log(e);
        if (e.key === "Enter" || e.type == "click") {
            emitSingleMessage(value);
            input.current.value = "";
            input.current.focus();
        }
    };

    return (
        <div className="chat">
            <div className="chat-container">
                <div ref={chatRef} className="messages">
                    {((!messages || messages.length == 0) && (
                        <div className="messages">
                            <h5>So far no Messages</h5>
                        </div>
                    )) ||
                        (messages &&
                            messages.map((msg, i) => (
                                <div className="message" key={i}>
                                    <div className="chat-image">
                                        <img src={msg.profile_pic_url} />
                                    </div>
                                    <div className="chat-right">
                                        <div className="chat-head">
                                            <h4>
                                                {msg.first} {msg.last}
                                            </h4>
                                            <p>{format_time(msg.created_at)}</p>
                                        </div>
                                        <div className="chat-body">
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            )))}
                </div>
                <div className="new-message">
                    <textarea
                        placeholder="type your message"
                        onChange={(e) => setValue(e.target.value)}
                        onKeyPress={(e) => submit(e)}
                        ref={input}
                        className="chat-input"
                    />
                    <button
                        disabled={!value}
                        onClick={(e) => {
                            submit(e);
                        }}
                    >
                        Publish Message
                    </button>
                </div>
            </div>
        </div>
    );
}
