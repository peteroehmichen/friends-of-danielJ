import { receiveChatMessages, newChatMessage, activeUsers } from "./action";
import { io } from "socket.io-client";
// import { useDispatch } from "react-redux";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("newMsg", (obj) => {
            // store.dispatch = useDispatch();
            // console.log("obj:", obj);
            return store.dispatch(newChatMessage(obj));
        });

        // socket.emit("Likewise", { answer: "good morning" });

        // listening to all server events and dispatching the correct action
        // receiving single message
        // receiving last 10 messages

        socket.on("activeUsers", (arr) => {
            // console.log("Users:", arr);
            return store.dispatch(activeUsers(arr));
        });
    }
};

export function emitSingleMessage(message) {
    socket.emit("newMessage", message);
}

export function requestNewestMessages() {
    //
}
