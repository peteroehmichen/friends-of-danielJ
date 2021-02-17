import { useState } from "react";
import BioEditor from "./bioEditor";
import { Spinner } from "./helpers";
import ProfilePic from "./profilePic";

export default function Profile(props) {
    const {
        first,
        last,
        profilePicUrl,
        bio,
        setBio,
        toggleUploadModal,
    } = props;

    // console.log("Props in Profile:", props);
    return (
        <div className="main-view own-profile debug-orange">
            <ProfilePic
                first={first}
                profilePicUrl={profilePicUrl}
                size="large"
                toggleUploadModal={toggleUploadModal}
            />
            <h2>
                Hello {first} {last}
            </h2>
            <BioEditor bio={bio} setBio={setBio} />
        </div>
    );
}

/*
DIRECT CHILD TO THE APP

shows user name


contains Component 
ProfilePic (has )
BioEditor (has bio inside)

*/
