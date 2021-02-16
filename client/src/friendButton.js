import axios from "./axios";
import { useState, useEffect } from "react";

export default function FriendButton(props) {
    const [btnText, setBtnText] = useState("");

    useEffect(() => {
        // console.log("initializing BTN for", props.friendId);
        axios
            .post("/api/user/friendBtn.json", {
                friendId: props.friendId,
                action: btnText,
            })
            .then((result) => {
                // console.log("answer from Friend-Button:", result);
                setBtnText(result.data.text);
            })
            .catch((err) => {
                console.log("friend-error:", err);
            });
    }, []);

    const clickHandler = (e) => {
        e.preventDefault();
        // console.log("Hello");
        axios
            .post("/api/user/friendBtn.json", {
                friendId: props.friendId,
                action: btnText,
            })
            .then((result) => {
                // console.log("answer from Friend-Button:", result);
                setBtnText(result.data.text);
            })
            .catch((err) => {
                console.log("friend-error:", err);
            });
    };

    return <button onClick={clickHandler}>{btnText}</button>;
}
