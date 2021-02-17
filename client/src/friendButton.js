import axios from "./axios";
import { useState, useEffect } from "react";
import { Spinner } from "./helpers";

export default function FriendButton(props) {
    const [btnText, setBtnText] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const request = async function () {
        try {
            setLoading(true);
            const result = await axios.post("/api/user/friendBtn.json", {
                friendId: props.friendId,
                action: btnText,
            });
            setBtnText(result.data.text);
            setLoading(false);
            if (result.data.error) {
                setError(true);
            } else {
                setError(false);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
        }
    };

    useEffect(() => {
        request();
    }, []);

    const clickHandler = (e) => {
        e.preventDefault();
        request();
    };

    return (
        <button
            className={(error && "error-btn") || " "}
            onClick={clickHandler}
            disabled={loading}
        >
            {loading ? <Spinner /> : btnText}
        </button>
    );
}
