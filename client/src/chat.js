import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveChatMessages } from "./action";
import Countdown from "./countdown";
import { format_time } from "./helpers";
import { emitSingleMessage } from "./socket";

// FIXME sorting of messages

export default function Chat(props) {
    const chatRef = useRef(null);
    const input = useRef(null);
    const [value, setValue] = useState("");
    const [userPM, setUserPM] = useState("0");
    const [reply, setReply] = useState("0");
    const [placeholder, setPlaceholder] = useState("");
    const dispatch = useDispatch();
    let messages = useSelector((store) => store.chat);
    const chatError = useSelector((store) => store.chatError);
    const msgError = useSelector((store) => store.msgError);
    const activeUsers = useSelector((store) => store.activeUsers || []);

    useEffect(() => {
        // console.log("receiving chat messages...");
        dispatch(receiveChatMessages(userPM));
    }, [userPM]);

    useEffect(() => {
        // console.log("scrolling to bottom");
        if (messages && chatRef.current) {
            chatRef.current.scrollTop =
                chatRef.current.scrollHeight - chatRef.current.clientHeight;
        }
    }, [messages]);

    const submit = function (e) {
        // console.log(e);
        if (e.key === "Enter" || e.type == "click") {
            e.preventDefault();
            emitSingleMessage({ recipient: userPM, replyTo: reply, value });
            input.current.value = "";
            input.current.focus();
            const oldAnswer = document.querySelector(".selectedAnswer");
            if (oldAnswer) {
                oldAnswer.classList.remove("selectedAnswer");
            }
            setReply("0");
            setPlaceholder("");
        }
        setValue(null);
    };
    // console.log("active Users:", activeUsers);

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
        const oldAnswer = document.querySelector(".selectedAnswer");
        if (oldUser) {
            oldUser.classList.remove("selected");
        }
        if (oldAnswer) {
            oldAnswer.classList.remove("selectedAnswer");
        }
        e.currentTarget.classList.add("selected");
        // console.log(e.currentTarget);

        setUserPM(e.currentTarget.id);
    };

    if (Array.isArray(messages)) {
        // console.log("type of messages:", Array.isArray(messages));
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
            {(chatError && (
                <div className="friends-error">
                    <h2>{chatError}</h2>
                    <h4>
                        Automatically redirecting you to Start-Page in
                        <Countdown
                            deadline={Date.now() + 5000}
                            actionOnEnd={() => props.history.push("/")}
                        />
                        seconds
                    </h4>
                </div>
            )) || (
                <div className="chat-frame">
                    <div className="user-frame">
                        <div
                            className="user-header selected"
                            id="0"
                            onClick={(e) => {
                                // e.stopPropagation();
                                // console.log(e);
                                setPlaceholder("");
                                selectedUser(e);
                            }}
                        >
                            <h1>ALL</h1>
                        </div>
                        <div className="active-users">
                            {Array.isArray(activeUsers) &&
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
                                        <div className="active-thumb">
                                            <img src={user.profile_pic_url} />
                                        </div>
                                        <div className="active-name">
                                            <b>{user.first}</b>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="chat-container">
                        <div ref={chatRef} className="messages">
                            {((!messages || messages.length == 0) && (
                                <h2>No Messages found</h2>
                            )) ||
                                (Array.isArray(messages) &&
                                    messages.map((msg, i) => (
                                        <div
                                            style={{
                                                marginLeft: `${
                                                    msg.indent * 30
                                                }px`,
                                            }}
                                            className={
                                                (msg.indent &&
                                                    "message indent") ||
                                                "message"
                                            }
                                            key={i}
                                        >
                                            <div className="chat-image">
                                                <img
                                                    src={msg.profile_pic_url}
                                                />
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
                                                            {msg.first}{" "}
                                                            {msg.last}
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
                                className={(msgError && "error-btn") || " "}
                                disabled={!value}
                                onClick={(e) => {
                                    submit(e);
                                }}
                            >
                                {(msgError && msgError) || "Publish Message"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
