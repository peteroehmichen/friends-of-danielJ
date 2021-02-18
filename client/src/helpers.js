import { useDispatch } from "react-redux";
import { acceptRequest, cancelRequest, denyRequest, unfriend } from "./action";

export function Spinner() {
    return (
        <div className="spinner">
            <img src="/autorenew.svg" alt="please wait" />
        </div>
    );
}

export function formEval(e) {
    const type = e.target.attributes.type.value;
    const value = e.target.value;

    e.target.style.borderBottom = "3px solid orangered";

    if (!value || value.startsWith(" ")) return false;
    if (type == "email" && !value.includes("@")) return false;

    e.target.style.borderBottom = "3px solid green";
    return value;
}

export function jsXListedItems(arr, type) {
    const dispatch = useDispatch();
    let jsXArr;
    if (type == "friend") {
        jsXArr = arr.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
    }
    if (type == "pending") {
        jsXArr = arr.filter(
            (elem) => !elem.confirmed && elem.recipient == elem.id
        );
    }
    if (type == "request") {
        jsXArr = arr.filter(
            (elem) => !elem.confirmed && elem.sender == elem.id
        );
    }

    jsXArr = jsXArr.map((elem) => {
        <div className="friend" key={elem.id}>
            <Link to={`/user/${elem.id}`}>
                <h3>
                    {elem.first} {elem.last}
                </h3>
            </Link>
            {type == "friend" && (
                <button onClick={() => dispatch(unfriend(elem.id))}>
                    cancel
                </button>
            )}
            {type == "request" && (
                <button onClick={() => dispatch(acceptRequest(elem.id))}>
                    accept
                </button>
            )}
            {type == "request" && (
                <button onClick={() => dispatch(denyRequest(elem.id))}>
                    deny
                </button>
            )}
            {type == "pending" && (
                <button onClick={() => dispatch(cancelRequest(elem.id))}>
                    cancel
                </button>
            )}
        </div>;
    });

    return jsXArr;
}
