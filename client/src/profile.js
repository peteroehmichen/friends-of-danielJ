import { useState } from "react";
import { useSelector } from "react-redux";
import BioEditor, { BioEditor2 } from "./bioEditor";
import { Spinner } from "./helpers";
import ProfilePic from "./profilePic";

export default function Profile(props) {
    const { user } = useSelector((store) => store);

    if (!user) return null;

    return (
        <div className="main-view own-profile">
            <ProfilePic size="large" />
            <div className="profile-information">
                <h2>
                    Hello, {user.first} {user.last}
                </h2>
                <BioEditor2 />
            </div>
        </div>
    );
}
