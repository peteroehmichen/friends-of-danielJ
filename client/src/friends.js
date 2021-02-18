import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    acceptRequest,
    cancelRequest,
    denyRequest,
    getList,
    unfriend,
} from "./action";

export default function Friends() {
    const dispatch = useDispatch();
    const all = useSelector((store) => store.relations);

    useEffect(() => {
        console.log("requesting friends from Server...");
        dispatch(getList());
    }, []);

    if (!all) {
        console.log("exiting");
        console.log("all:", all);
        return null;
    }
    let allElements;
    if (!all.length) {
        allElements = <div>there are none</div>;
    } else {
        allElements = all.map((elem) => (
            <div className="friend" key={elem.id}>
                <h3>
                    {elem.first} {elem.last}
                </h3>
            </div>
        ));
    }

    let friends;
    if (all.length > 0) {
        friends = all.filter((elem) => elem.confirmed);
        friends = friends.map((elem) => (
            <div className="friend" key={elem.id}>
                <h3>
                    {elem.first} {elem.last}
                </h3>
                <button onClick={() => dispatch(unfriend(elem.id))}>
                    Unfriend
                </button>
            </div>
        ));
    }
    let requests;
    if (all.length > 0) {
        requests = all.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
        requests = requests.map((elem) => (
            <div className="friend" key={elem.id}>
                <h3>
                    {elem.first} {elem.last}
                </h3>
                <button onClick={() => dispatch(acceptRequest(elem.id))}>
                    accept
                </button>
                <button onClick={() => dispatch(denyRequest(elem.id))}>
                    deny
                </button>
            </div>
        ));
    }
    let pending;
    if (all.length > 0) {
        pending = all.filter(
            (elem) => !elem.confirmed && elem.recipient == elem.id
        );
        pending = pending.map((elem) => (
            <div className="friend" key={elem.id}>
                <h3>
                    {elem.first} {elem.last}
                </h3>
                <button onClick={() => dispatch(cancelRequest(elem.id))}>
                    cancel
                </button>
            </div>
        ));
    }

    return (
        <div className="main-view find-friends debug-green">
            <h1>We are your friends...</h1>
            <div className="friends">
                <h2>all relations</h2>
                {allElements}
            </div>
            <div className="friends">
                <h2>only friends</h2>
                {friends}
            </div>
            <div className="friends">
                <h2>request to you</h2>
                {requests}
            </div>
            <div className="friends">
                <h2>pending from you</h2>
                {pending}
            </div>
        </div>
    );
}
