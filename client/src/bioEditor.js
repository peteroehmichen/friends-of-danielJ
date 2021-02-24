import axios from "./axios";
import { Spinner } from "./helpers";
import React, { useEffect, useState } from "react";
import Countdown from "./countdown";
import { useDispatch, useSelector } from "react-redux";
import { updateBio, toggleBioEditor } from "./action";

export function BioEditor2() {
    const dispatch = useDispatch();
    const { user, activeBioEditor } = useSelector((store) => store);

    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user) return null;

    const off = (
        <div>
            <p>{user.bio}</p>
            <button
                className={(user.bioError && "error-btn") || " "}
                disabled={user.bioError}
                onClick={() => {
                    setValue(user.bio);
                    dispatch(toggleBioEditor());
                }}
            >
                {(user.bioError && user.bioError) ||
                    (user.bio ? "edit Bio" : "add Bio")}
            </button>
        </div>
    );
    const on = (
        <div>
            <textarea
                placeholder="Tell us a bit about you..."
                defaultValue={user.bio}
                onChange={(e) => setValue(e.target.value)}
            />
            <div className="bioBtns">
                <div>
                    <button
                        onClick={() => {
                            dispatch(toggleBioEditor());
                        }}
                    >
                        cancel
                    </button>
                </div>
                <div>
                    {(loading && (
                        <button disabled={true}>
                            <Spinner />
                        </button>
                    )) || (
                        <button
                            onClick={async () => {
                                setLoading(true);
                                await dispatch(updateBio(value));
                                dispatch(toggleBioEditor());
                                setLoading(false);
                            }}
                        >
                            Save Bio
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
    return <div className="bio">{activeBioEditor ? on : off}</div>;
}

// export default class BioEditor extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             activeEditor: false,
//             bio: "",
//             error: "",
//             loading: false,
//         };
//         this.toggleEditor = this.toggleEditor.bind(this);
//         this.saveBio = this.saveBio.bind(this);
//         this.handleChange = this.handleChange.bind(this);
//     }

//     componentDidMount() {
//         this.setState({
//             bio: this.props.bio,
//         });
//     }

//     handleChange(e) {
//         this.setState({
//             bio: e.target.value,
//         });
//         // console.log("state in BioEditor:", this.state);
//     }

//     toggleEditor() {
//         this.setState({
//             activeEditor: !this.state.activeEditor,
//         });
//     }

//     async saveBio() {
//         try {
//             this.setState({
//                 loading: true,
//             });
//             const result = await axios.post("/api/profile-bio.json", {
//                 bio: this.state.bio,
//             });
//             this.setState({ loading: false });
//             if (result.data.update) {
//                 this.props.setBio(this.state.bio);
//                 this.toggleEditor();
//             } else {
//                 this.setState({
//                     error: result.data.error,
//                 });
//             }
//         } catch (err) {
//             console.log("there was an error in sending BIO:", err);
//             this.setState({
//                 loading: false,
//                 error: "Error in Connecting to Server",
//             });
//         }
//     }

//     render() {
//         const buttonText = this.props.bio ? "edit Bio" : "add Bio";
//         const off = (
//             <div>
//                 <p>{this.props.bio}</p>
//                 <button onClick={this.toggleEditor}>{buttonText}</button>
//             </div>
//         );

//         const waitButton = this.state.loading ? (
//             <button disabled={true}>
//                 <Spinner />
//             </button>
//         ) : (
//             <button
//                 className={(this.state.error && "error-btn") || " "}
//                 onClick={this.saveBio}
//                 disabled={this.state.error}
//             >
//                 {this.state.error ? this.state.error : "Save Bio"}
//             </button>
//         );
//         let on = (
//             <div>
//                 <textarea
//                     defaultValue={this.props.bio}
//                     onChange={this.handleChange}
//                 />
//                 {waitButton}
//             </div>
//         );
//         return (
//             <div className="bio">{(this.state.activeEditor && on) || off}</div>
//         );
//     }
// }
