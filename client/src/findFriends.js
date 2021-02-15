import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default function FindFriends(props) {
    const [searchInput, setSearchInput] = useState("");
    const [friends, setFriends] = useState([]);
    const [msg, setMsg] = useState([]);

    useEffect(() => {
        // this is the place for an axios
        let abort;
        axios
            .get(`/api/findUsers.json?search=${searchInput}`)
            .then((result) => {
                // console.log("friends:", result.data.result);
                if (!result.data.result) {
                    result.data.result = [];
                }
                if (!abort) {
                    setFriends(result.data.result);
                }
                if (result.data.error) {
                    setMsg(result.data.error);
                } else if (result.data.search) {
                    setMsg(
                        `we found ${result.data.result.length} matches for you`
                    );
                } else {
                    setMsg(
                        `displaying the ${result.data.result.length} newest users`
                    );
                }
            })
            .catch((err) => {
                setMsg("We encountered an unknown error");
            });
        return () => {
            abort = true;
        };
        // return a cleanup
    }, [searchInput]);

    return (
        <div className="main-view find-friends debug-green">
            <h3>Find likeminded people</h3>
            <input
                type="text"
                name="searchFriend"
                placeholder="Enter a name"
                id="searchFriend"
                key="searchFriend"
                onChange={(e) => {
                    setSearchInput(e.target.value);
                }}
            />
            <div className="friend-results">
                <div className="friend-results-header">
                    <h4>{msg}</h4>
                </div>
                <div className="friend-results-body">
                    {friends.map((elem, index) => {
                        return (
                            <div key={index} className="found-friend">
                                <div className="friend-pic-small">
                                    <Link to={`/user/${elem.id}`}>
                                        <img
                                            src={elem.profile_pic_url}
                                            alt=""
                                        />
                                    </Link>
                                </div>
                                <div className="friend-summary">
                                    <h4>
                                        {elem.first} {elem.last}
                                    </h4>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
