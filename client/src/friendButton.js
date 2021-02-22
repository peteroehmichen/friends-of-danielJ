import axios from "./axios";
import { useState, useEffect } from "react";
import { Spinner } from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import { submitFriendAction } from "./action";

export default function FriendButton(props) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { nextFriendAction, dbError } = useSelector(
        (store) => store.otherUser
    );

    const request = async function (task) {
        // setLoading(true);
        dispatch(submitFriendAction(props.friendId, task));
        // setLoading(false);
    };

    useEffect(() => {
        request("");
    }, []);

    // console.log("nextFriendAction:", nextFriendAction);
    // console.log("dbError:", dbError);

    if (!nextFriendAction) return null;

    return (
        <button
            className={(dbError && "error-btn") || " "}
            onClick={() => {
                request(nextFriendAction);
            }}
            disabled={loading}
        >
            {loading ? <Spinner /> : nextFriendAction}
        </button>
    );
}
