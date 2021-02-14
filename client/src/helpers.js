export function Spinner() {
    return (
        <div className="spinner">
            <img src="autorenew.svg" alt="please wait" />
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
