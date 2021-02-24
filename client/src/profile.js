import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "./action";
import BioEditor, { BioEditor2 } from "./bioEditor";
import { Spinner } from "./helpers";
import ProfilePic from "./profilePic";

export default function Profile() {
    const { user } = useSelector((store) => store);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserData("0"));
    }, []);

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
