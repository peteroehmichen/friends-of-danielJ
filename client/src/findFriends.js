import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import Countdown from "./countdown";

export default function FindFriends(props) {
    const [searchInput, setSearchInput] = useState("");
    const [friends, setFriends] = useState([]);
    const [msg, setMsg] = useState([]);
    const [error, setError] = useState("");

    useEffect(async () => {
        let abort;
        try {
            const { data } = await axios.get(
                `/api/findUsers.json?search=${searchInput}`
            );
            console.log("data:", data);
            if (!data.result) {
                data.result = [];
            }
            if (!abort) {
                setFriends(data.result);
            }
            if (data.error) {
                // console.log("writing error");
                setError(data.error);
            } else if (data.empty) {
                setMsg(data.empty);
            } else if (data.search) {
                setMsg(`We found ${data.result.length} matches for you`);
            } else {
                setMsg(`These are our ${data.result.length} newest users`);
            }
        } catch (err) {
            setError("We encountered an unknown error");
        }

        return () => {
            abort = true;
        };
    }, [searchInput]);

    return (
        <div className="main-view find-friends">
            {error && (
                <div className="friends-error">
                    <h2>{error}</h2>
                    <h4>Automatically redirecting you to Start-Page in </h4>
                    <Countdown
                        deadline={Date.now() + 5000}
                        actionOnEnd={() => props.history.push("/")}
                    />
                </div>
            )}
            {!error && (
                <div>
                    <input
                        type="text"
                        name="searchFriend"
                        placeholder="Search through our Users"
                        id="searchFriend"
                        key="searchFriend"
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                        }}
                    />
                    <div className="friend-results">
                        <div className="friend-results-header">
                            <h2>
                                {msg}
                                {error}
                            </h2>
                        </div>
                        <div className="friend-results-body">
                            {friends.map((elem, index) => {
                                let name = elem.first + " " + elem.last;
                                const regex = new RegExp(searchInput, "gi");
                                const one = name.slice(0, name.search(regex));
                                const tag = name.substr(
                                    name.search(regex),
                                    searchInput.length
                                );
                                const rest = name.slice(
                                    name.search(regex) + searchInput.length
                                );
                                name = (
                                    <h3>
                                        {one}
                                        <u>{tag}</u>
                                        {rest}
                                    </h3>
                                );

                                return (
                                    <div key={index} className="found-friend">
                                        <div className="friend-pic-small">
                                            <img
                                                src={
                                                    elem.profile_pic_url ||
                                                    "/default_user.svg"
                                                }
                                                alt="thumbnail"
                                                onError={(e) => {
                                                    e.target.setAttribute(
                                                        "src",
                                                        "/default_user.svg"
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="friend-summary">
                                            <div className="friend-name">
                                                {name}
                                            </div>
                                        </div>
                                        <div className="friend-function">
                                            <Link to={`/user/${elem.id}`}>
                                                <img src="/arrow.png" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
