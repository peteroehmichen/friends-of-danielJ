// import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { toggleUploadModal } from "./action";

export default function ProfilePic(props) {
    // console.log("Props in ProfilePic:", props);
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();

    return (
        <img
            src={user.profilePicUrl}
            alt={user.first}
            className={`profile-picture ${props.size}`}
            onClick={() => {
                if (props.size == "large") {
                    dispatch(toggleUploadModal());
                }
            }}
        />
    );
}
