import axios from "./axios";

export async function getList() {
    const { data } = await axios.get("/api/friends.json");
    console.log("data from server", data);
    return {
        type: "GET_ALL_RELATIONS",
        payload: data,
    };
}

export async function unfriend(id) {
    // console.log("Going to unfriend id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        action: "Cancel Friendship",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "CANCEL_FRIENDSHIP",
            payload: id,
        };
    }
}

export async function acceptRequest(id) {
    // console.log("Going to accept id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        action: "Accept Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "ACCEPT_REQUEST",
            payload: id,
        };
    }
}

export async function denyRequest(id) {
    // console.log("Going to deny id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        action: "Deny Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "DENY_REQUEST",
            payload: id,
        };
    }
}

export async function cancelRequest(id) {
    // console.log("Going to cancel id", id);
    const { data } = await axios.post("/api/user/friendBtn.json", {
        action: "Cancel Request",
        friendId: id,
    });
    if (!data.error) {
        return {
            type: "CANCEL_REQUEST",
            payload: id,
        };
    }
}
