export default function reducer(store = {}, action) {
    if (action.type == "GET_ALL_RELATIONS") {
        store = {
            ...store,
            relations: action.payload,
        };
    }

    if (action.type == "CANCEL_FRIENDSHIP") {
        store = {
            ...store,
            relations: store.relations.filter(
                (user) => user.id != action.payload
            ),
        };
    }

    if (action.type == "ACCEPT_REQUEST") {
        store = {
            ...store,
            relations: store.relations.map((user) => {
                if (user.sender == action.payload) {
                    return {
                        ...user,
                        confirmed: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "CANCEL_REQUEST") {
        store = {
            ...store,
            relations: store.relations.filter(
                (user) => user.recipient != action.payload
            ),
        };
    }

    if (action.type == "DENY_REQUEST") {
        store = {
            ...store,
            relations: store.relations.filter(
                (user) => user.sender != action.payload
            ),
        };
    }

    if (action.type == "FULL_USER_DATA") {
        if (!action.payload.profilePicUrl) {
            action.payload.profilePicUrl = "/default_user.svg";
        }
        store = {
            ...store,
            user: action.payload,
        };
    }

    if (action.type == "TOGGLE_UPLOAD_MODAL") {
        store = {
            ...store,
            user: {
                ...store.user,
            },
            activateUploadModal:
                store.activateUploadModal == null
                    ? true
                    : !store.activateUploadModal,
        };
    }

    if (action.type == "TOGGLE_BIO_EDITOR") {
        store = {
            ...store,
            user: {
                ...store.user,
            },
            activeBioEditor:
                store.activeBioEditor == null ? true : !store.activeBioEditor,
        };
    }

    if (action.type == "UPDATE_BIO") {
        // maybe handle errors and thik about handling loading
        store = {
            ...store,
            user: {
                ...store.user,
            },
        };
        if (action.payload.error) {
            store.user.bioError = action.payload.error;
        } else {
            store.user.bio = action.payload;
            store.user.bioError = null;
        }
    }
    return store;
}
