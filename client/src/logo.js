// import React from "react";

export default function Logo(props) {
    return (
        <div className={props.design}>
            <img src="/logo_pure.png" />
            {props.withTitle && (
                <div>
                    <h1>
                        Friends of <br /> Daniel Johnston
                    </h1>
                </div>
            )}
        </div>
    );
}

/* 


*/
