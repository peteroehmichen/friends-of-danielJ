import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    acceptRequest,
    cancelRequest,
    denyRequest,
    getList,
    unfriend,
} from "./action";
import Countdown from "./countdown";
import { jsXListedItems } from "./helpers";

export default function Friends(props) {
    const dispatch = useDispatch();
    const all = useSelector((store) => store.relations);

    useEffect(() => {
        // console.log("requesting friends from Server...");
        dispatch(getList());
    }, []);

    let friends = <div>There are none</div>;
    let requests;
    let pending;
    let error;

    if (!all) {
        return null;
    } else if (all.error) {
        console.log("We hit an error:", all.error);
        error = all.error;
    } else if (all.length > 0) {
        friends = all.filter((elem) => elem.confirmed);
        requests = all.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
        pending = all.filter(
            (elem) => !elem.confirmed && elem.recipient == elem.id
        );

        if (!friends.length) {
            friends = <div>There are none</div>;
        } else {
            friends = friends.map((elem) => (
                <div className="friend" key={elem.id}>
                    <Link to={`/user/${elem.id}`}>
                        <div className="friend-img">
                            <img src={elem.profile_pic_url} />
                        </div>
                    </Link>
                    <div className="friend-functions">
                        <h3>
                            {elem.first} {elem.last[0]}.
                        </h3>
                        <h2 onClick={() => dispatch(unfriend(elem.id))}>✘</h2>
                    </div>
                </div>
            ));
        }

        requests = requests.map((elem) => (
            <div className="friend" key={elem.id}>
                <Link to={`/user/${elem.id}`}>
                    <div className="friend-img">
                        <img src={elem.profile_pic_url} />
                    </div>
                </Link>
                <div className="friend-functions">
                    <h3>
                        {elem.first} {elem.last[0]}.
                    </h3>
                    <div>
                        <h2 onClick={() => dispatch(acceptRequest(elem.id))}>
                            ✓
                        </h2>
                        <h2 onClick={() => dispatch(denyRequest(elem.id))}>
                            ✘
                        </h2>
                    </div>
                </div>
            </div>
        ));

        pending = pending.map((elem) => (
            <div className="friend" key={elem.id}>
                <Link to={`/user/${elem.id}`}>
                    <div className="friend-img">
                        <img src={elem.profile_pic_url} />
                    </div>
                </Link>
                <div className="friend-functions">
                    <h3>
                        {elem.first} {elem.last[0]}.
                    </h3>
                    <h2 onClick={() => dispatch(cancelRequest(elem.id))}>✘</h2>
                </div>
            </div>
        ));
    }

    return (
        <div className="main-view friends">
            {error && (
                <div className="friends-error">
                    <h2>{error}</h2>
                    <h4>
                        Automatically redirecting you to Start-Page in
                        <Countdown
                            deadline={Date.now() + 5000}
                            actionOnEnd={() => props.history.push("/")}
                        />
                        seconds
                    </h4>
                </div>
            )}
            {!error && (
                <div className="friends-list">
                    <h1>Your Friends</h1>
                    <div className="friends-list-body">{friends}</div>
                </div>
            )}
            {requests && requests.length > 0 && (
                <div className="friends-list">
                    <h2>Friend-Requests awaiting your answer</h2>
                    <div className="friends-list-body">{requests}</div>
                </div>
            )}
            {pending && pending.length > 0 && (
                <div className="friends-list">
                    <h2>Unanswered Friend-Request from you</h2>
                    <div className="friends-list-body">{pending}</div>
                </div>
            )}
        </div>
    );
}
