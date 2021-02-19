import { useDispatch } from "react-redux";
import { acceptRequest, cancelRequest, denyRequest, unfriend } from "./action";
import { useState } from "react";
import axios from "./axios";

export function Spinner() {
    return (
        <div className="spinner">
            <img src="/autorenew.svg" alt="please wait" />
        </div>
    );
}

export function useAthenticate(url, values) {
    const [status, setStatus] = useState({
        error: false,
        loading: false,
    });

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        try {
            setStatus({
                ...status,
                loading: true,
            });
            const { data } = await axios.post(url, values);
            if (data.status == "OK") {
                setStatus({
                    ...status,
                });
                location.replace("/");
            } else if (data.error) {
                setStatus({
                    ...status,
                    error: data.error,
                });
            }
        } catch (err) {
            console.log("error in axios welcomePost", err);
            setStatus({
                ...status,
                error: "No Database Connection",
            });
        }

        // FIXME uncool TimeOut (require Help)
        setTimeout(() => {
            setStatus({
                ...status,
                error: false,
                loading: false,
            });
        }, 5000);
    };
    return [status, handleAuthSubmit];
}

export function useFormEval() {
    const [values, setValues] = useState({});

    const handleChangeEval = (e) => {
        e.target.style.borderBottom = "3px solid orangered";

        let value = e.target.value;
        if (!value || value.startsWith(" ")) {
            value = false;
        }
        if (
            e.target.attributes.type.value == "email" &&
            !e.target.value.includes("@")
        ) {
            value = false;
        }

        if (value) {
            setValues({
                ...values,
                [e.target.name]: value,
            });
            e.target.style.borderBottom = "3px solid green";
        } else {
            setValues({
                ...values,
                [e.target.name]: "",
            });
        }
    };
    return [values, handleChangeEval];
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
