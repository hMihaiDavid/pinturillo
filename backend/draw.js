module.exports = {init: init};

let io;

function init(_io) {
    io = _io;

    io.on('connection', handleConnection);
}

let handleConnection =  (sock) => {
    console.log('[DEBUG] connected sockid:',sock.id);

    sock.on('disconnect', () => {
        console.log('[DEBUG] disconnect sockid:',sock.id)
    });

    sock.on('join', (n, r) => )
}