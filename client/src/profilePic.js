// import React from "react";

export default function ProfilePic(props) {
    return (
        <div className="profile-picture">
            <h1>
                Hello, {props.first} {props.last}
            </h1>
            <img src={props.profilePicUrl} alt={props.first} />
            <button onClick={props.toggleUploadModal}>change Picture</button>
        </div>
    );
}

/* 
display the pictureURL and name of profile from props

*/
