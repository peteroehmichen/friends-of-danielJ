import axios from "./axios";
import { useRef, useState } from "react";
import { Spinner } from "./helpers";
import { useDispatch, useSelector } from "react-redux";
import { toggleUploadModal, updateProfilePicture } from "./action";

export default function Uploader() {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [confirm, setConfirm] = useState("");
    const container = useRef();
    const one = useRef();
    const slider = useRef();
    let minY, maxY;

    function selectHandler(e) {
        e.target.labels[0].style.borderBottom = "3px solid orangered";
        if (e.target.files.length < 1) {
            setFile("");
            setFilename("");
            setError("");
        } else if (e.target.files[0].size > 2097152) {
            setFile("");
            setFilename("max. 2 MB");
            setError("File Size too large");
        } else {
            let shortened = e.target.files[0].name;
            shortened =
                shortened.length > 18
                    ? shortened.slice(0, 18) + "..."
                    : shortened;
            setFile(e.target.files[0]);
            setFilename(shortened);
            setError("");

            e.target.labels[0].style.borderBottom = "3px solid green";
        }
    }

    async function uploadPicture() {
        setLoading(true);

        const profilePicture = new FormData();
        profilePicture.append("file", file);
        profilePicture.append("old", user.profilePicUrl);

        const response = {};
        try {
            const { data } = await axios.post(
                "/api/user/profile-pic.json",
                profilePicture
            );
            if (!data.error) {
                response.url = data.url;
            } else {
                response.error = data.error;
                setError(data.error);
            }
        } catch (err) {
            console.log("error in Upload Post:", err);
            response.error = "unknown server error";
            setError("unknown server error");
        }

        dispatch(updateProfilePicture(response));
        setLoading(false);
    }

    function shiftPane(evt) {
        evt.preventDefault();
        console.log("mouseMOVE");
        if (evt.clientY >= minY && evt.clientY <= maxY) {
            const newPosition = evt.clientY - minY;
            one.current.style.height = newPosition + "px";
            slider.current.style.top = newPosition + "px";
        }
    }
    // FIXME still buggy sliding
    function startDrag(e) {
        e.preventDefault();
        console.log("mouseDOWN:");
        minY = e.clientY - e.target.offsetTop;
        maxY = minY + container.current.offsetHeight;
        container.current.addEventListener("mousemove", shiftPane);
    }

    function stopDrag(evt) {
        // evt.preventDefault();
        console.log("mouseUP");
        container.current.removeEventListener("mousemove", shiftPane);
    }

    async function deleteAccount(e) {
        e.preventDefault();
        console.log("clicked with", e.target.innerText);
        if (e.target.innerText == "Are you SURE?") {
            setLoading(true);
            setConfirm("deleting...");
            const result = await axios.post("/api/deleteUser", {
                url: user.profilePicUrl,
            });
            // TODO Check errors
            setLoading(false);
            location.replace("/logout");
        } else {
            setLoading(true);
            setConfirm("please wait...");
            setLoading(false);
            setTimeout(() => {
                setConfirm("Are you SURE?");
            }, 3000);
        }
    }

    return (
        <div className="overlay">
            <div className="uploader">
                <div className="uploader-head">
                    <div>
                        <h2>Settings</h2>
                    </div>
                    <div
                        className="close"
                        onClick={() => {
                            dispatch(toggleUploadModal());
                        }}
                    >
                        X
                    </div>
                </div>
                <div
                    className="uploader-body"
                    ref={container}
                    onMouseUp={stopDrag}
                >
                    {(user && (
                        <div className="pane one" ref={one}>
                            <h2>stats and functions</h2>
                            <h3>
                                {user.first} {user.last}
                            </h3>
                            <p>
                                User since:{" "}
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                            <p>Number of Friends: {user.total}</p>
                            <button disabled={loading} onClick={deleteAccount}>
                                {confirm || "delete Account"}
                            </button>
                        </div>
                    )) || (
                        <div className="pane one">
                            <h1>user not found</h1>
                        </div>
                    )}
                    <div className="pane two">
                        <h2>Upload your Profile Picture</h2>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            accept="image/*"
                            onChange={selectHandler}
                            key={4}
                        />
                        <label htmlFor="file">
                            <img src="/upload_black.svg" />
                            <span>{filename || "Please select an image"}</span>
                        </label>
                        <button
                            className={(error && "error-btn") || " "}
                            disabled={!file || error || loading}
                            onClick={() => uploadPicture()}
                        >
                            {error ? (
                                error
                            ) : loading ? (
                                <Spinner />
                            ) : (
                                "Upload Picture"
                            )}
                        </button>
                        <img className="upload-image" src="/On_the_rock.jpg" />
                    </div>
                    <div
                        ref={slider}
                        className="pane slider"
                        onMouseDown={startDrag}
                    ></div>
                </div>
            </div>
        </div>
    );
}
