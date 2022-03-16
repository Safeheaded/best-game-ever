let socket;

export const getSocket = () => {
    if (!socket) {
        socket = new WebSocket('ws://127.0.0.1:8081/room/socket');
    }
    return socket;

}