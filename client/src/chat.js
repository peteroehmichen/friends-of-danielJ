import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages } from "./action";
import { format_time } from "./helpers";
import { emitSingleMessage } from "./socket";

export default function Chat() {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const [userPM, setUserPM] = useState("0");
    const [reply, setReply] = useState("0");
    const [placeholder, setPlaceholder] = useState("");
    const dispatch = useDispatch();
    let messages = useSelector((store) => store.chat);
    const error = useSelector((store) => store.chatError);
    const activeUsers = useSelector((store) => store.activeUsers || []);

    useEffect(() => {
        dispatch(receiveChatMessages(userPM));
    }, [userPM]);

    useEffect(() => {
        if (messages) {
            chatRef.current.scrollTop =
                chatRef.current.scrollHeight - chatRef.current.clientHeight;
        }
    }, [messages]);

    const submit = function (e) {
        setValue(null);
        // console.log(e);
        if (e.key === "Enter" || e.type == "click") {
            emitSingleMessage({ recipient: userPM, replyTo: reply, value });
            input.current.value = "";
            input.current.focus();
        }
    };
    // console.log(activeUsers);

    const selectReply = function (e) {
        if (e.target.classList.contains("selectedAnswer")) {
            e.target.classList.remove("selectedAnswer");
            setReply("0");
            setPlaceholder("");
        } else {
            const prevAnwer = document.querySelector(".selectedAnswer");
            if (prevAnwer) {
                prevAnwer.classList.remove("selectedAnswer");
            }
            e.target.classList.add("selectedAnswer");
            setReply(e.target.id);
        }
    };

    const selectedUser = function (e) {
        const oldUser = document.querySelector(".selected");
        if (oldUser) {
            oldUser.classList.remove("selected");
        }
        e.target.classList.add("selected");
        setUserPM(e.target.id);
    };

    if (messages) {
        messages = messages.filter((message) => {
            if (userPM == 0) {
                return !message.private;
            } else {
                return !message.public;
            }
        });
    }

    return (
        <div className="chat">
            <div className="chat-frame">
                <div className="user-frame">
                    <div
                        className="user-header"
                        id="0"
                        onClick={(e) => {
                            // e.stopPropagation();
                            // console.log(e);
                            setPlaceholder(`Your Message...`);
                            selectedUser(e);
                        }}
                    >
                        <h1 id="0" className="selected">
                            ALL
                        </h1>
                    </div>
                    <div className="active-users">
                        {activeUsers &&
                            activeUsers.map((user) => (
                                <div
                                    key={user.id}
                                    id={user.id}
                                    className="active-user"
                                    onClick={(e) => {
                                        setPlaceholder(
                                            `Your Message to ${user.first}...`
                                        );

                                        selectedUser(e);
                                    }}
                                >
                                    <div id={user.id} className="active-thumb">
                                        <img
                                            id={user.id}
                                            src={user.profile_pic_url}
                                        />
                                    </div>
                                    <div id={user.id} className="active-name">
                                        <b id={user.id}>{user.first}</b>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="chat-container">
                    <div ref={chatRef} className="messages">
                        {((!messages || messages.length == 0) && (
                            <div className="messages">
                                <h5>So far no Messages</h5>
                            </div>
                        )) ||
                            (messages &&
                                messages.map((msg, i) => (
                                    <div
                                        style={{
                                            marginLeft: `${msg.indent * 20}px`,
                                        }}
                                        className="message"
                                        key={i}
                                    >
                                        <div className="chat-image">
                                            <img src={msg.profile_pic_url} />
                                        </div>
                                        <div className="chat-right">
                                            <div
                                                className="reply"
                                                id={msg.id}
                                                onClick={(e) => {
                                                    setPlaceholder(
                                                        `Your Answer to ${msg.first}...`
                                                    );
                                                    selectReply(e);
                                                }}
                                            >
                                                ↩
                                            </div>
                                            <div className="chat-head">
                                                <p>
                                                    <b>
                                                        {msg.first} {msg.last}
                                                    </b>
                                                    ,{" "}
                                                    {format_time(
                                                        msg.created_at
                                                    )}
                                                </p>
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
                            placeholder={placeholder || "Your Message..."}
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
                            {(error && error) || "Publish Message"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
