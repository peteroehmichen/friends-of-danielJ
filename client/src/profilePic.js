// import React from "react";

export default function ProfilePic(props) {
    // console.log("Props in ProfilePic:", props);

    return (
        <img
            src={props.profilePicUrl}
            alt={props.first}
            className={`profile-picture debug-green ${props.size}`}
            onClick={props.toggleUploadModal}
        />
    );
}

/* 
display the pictureURL and name of profile from props

*/
