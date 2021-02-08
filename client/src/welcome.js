import Registration from "./registration";
// Welcome component to render register or login (full not logged-in experience)
// sole purpose is to create the pane for registration component

// called "dumb" or "presentational" components (because they dont have much functionaility. - "Pre-hooks")
export default function Welcome() {
    return (
        <div>
            <h1>Welcome!</h1>
            <Registration />
        </div>
    );
}
