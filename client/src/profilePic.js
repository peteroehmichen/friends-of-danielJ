// import React from "react";

export default function ProfilePic(props) {
    // console.log("Props in ProfilePic:", props);

    return (
        <img
            src={props.profilePicUrl}
            alt={props.first}
            className={`profile-picture ${props.size}`}
            onClick={
                (props.size == "large" && props.toggleUploadModal) ||
                function () {}
            }
        />
    );
}
