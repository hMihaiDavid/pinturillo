module.exports = {init: init};

let io;
let roomService;

function init(_io, _roomService) {
    io = _io;
    roomService = _roomService;

    io.on('connection', handleConnection);
}

let handleConnection =  (sock) => {
    console.log('[DEBUG] connected sockid:',sock.id);

    sock.on('disconnect', () => {
        console.log('[DEBUG] disconnect sockid:',sock.id)
    });

    sock.on('join', (n, r) => {

    });
}