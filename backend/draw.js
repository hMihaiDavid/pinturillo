module.exports = {init: init};

let io;
let rooms;

// TODO SANITIZATION AND MAYBE REFACTOR PLAYERS INTO OBJ?? NAH

const MAX_NICK_LEN = 30;

function init(_io, _rooms) {
    io = _io;
    rooms = _rooms;

    io.on('connection', handleConnection);
}

let handleConnection =  (sock) => {
    console.log('[DEBUG] connected sockid:',sock.id);
    let conn = {sock: sock,
                nick: null,
                currentRoom: null}; /* this represents the state of this conneciton. */

    sock.on('disconnect', () => handleDisconnect(conn));
    sock.on('join', (roomId, nick) => handleJoin(conn, roomId, nick));
    sock.on('chat', (text) => handleMsg(conn, text));
    sock.on('stroke', (pos) => handleStroke(conn, pos));
    sock.on('penup', (pos) => handlePenUp(conn, pos));
    sock.on('pendown', (pos) => handlePenDown(conn, pos));
    sock.on('clear', (pos) => handleClear(conn));

}

function handleDisconnect(conn) {
    console.log('[DEBUG] disconnect sockid:',conn.sock.id);
    if(!conn.currentRoom) return;
    
    removeNick(conn.nick, conn.currentRoom);
    conn.sock.broadcast.to(conn.currentRoom.id+'/chat').emit('chat', {
        type: 'info',
        op: 'leave',
        nick: conn.nick
    });

    }

function handleJoin(conn, roomId, nick) {
    let sock = conn.sock;

    // Input validation and sanity checks...
    if( typeof(roomId) !== 'string' && roomId.length > 20) 
        return sock.disconnect();
    let room = rooms[roomId];
    nick = sanitizeNick(nick);
    if(!nick) return sock.disconnect();

    if(!room)
        return sock.emit('join rep', {error:1, msg:"Room does not exist."});
    
    if(room.players.length === room.maxPlayers)
        return sock.emit('join rep', {error:2, msg: "Room is full", maxPlayers: room.maxPlayers});

    // if the nick is already taken, add a number to it, mik#2, mike#3 ...
    nick = setNick(nick, room);
    conn.nick = nick;
    conn.currentRoom = room;
    

    sock.join(room.id+'/data');
    sock.join(room.id+'/chat');
    sock.emit('join rep', {ok:1, nick:nick});
    sock.broadcast.to(conn.currentRoom.id+'/chat').emit('chat', {
        type: 'info',
        op: 'join',
        nick: nick
    });
    console.log(nick, "joined room", room.id, "(sockid:"+sock.id+")")
}

function handleMsg(conn, text) {
    // TODO: IMPLEMENT SANITIZATION
    //let text = sanitizeChatMessage(text);
    
    let msg = {
        type: 'msg',
        from: conn.nick,
        text: text
    };
    conn.sock.broadcast.to(conn.currentRoom.id+'/chat').emit('chat', msg);
}

function handlePenUp(conn, pos) {
    /*if(!checkTypePos(pos))
        return conn.sock.disconnect();*/
        console.log(pos);

    conn.sock.broadcast.to(conn.currentRoom.id+'/data').emit('penup', pos);
}

function handlePenDown(conn, pos) {
    /*if(!checkTypePos(pos))
        return conn.sock.disconnect();*/
        console.log(pos);

    conn.sock.broadcast.to(conn.currentRoom.id+'/data').emit('pendown', pos);    

}


function handleStroke(conn, pos) {
    /*if(!checkTypePos(pos))
        return conn.sock.disconnect();*/
        
    conn.sock.broadcast.to(conn.currentRoom.id+'/data').emit('stroke', pos);
}

function handleClear(conn) {
    conn.sock.broadcast.to(conn.currentRoom.id+'/data').emit('clear');
}

function checkTypePos(o) {
    if(
        typeof(o)   == 'object' &&
        typeof(o.x) == 'number' &&
        typeof(o.y) == 'number' &&
        Object.entries(o).length == 2
    )
        return true;

    return false;
}

/* precondition: nick is a sanitized nick string. */
function setNick(nick, room) {
    let nickOcurrences = room._nickOcurrences;
    let actualNick = nick;

    let n = nickOcurrences[nick];
    if(!n || n <= 0) n = 1;
    else  {
        n++;
        actualNick = nick+'#'+n;
    }

    nickOcurrences[nick] = n;

    room.players.push(actualNick);

    return actualNick;
}
// TODO refactor room out into an object
function removeNick(nick, room) {
    let nickOcurrences = room._nickOcurrences;
    let players = room.players;

    let baseNick = nick.split('#')[0];
    let n = nickOcurrences[baseNick];
    n--;
    if(!n || n<=0) n = undefined;
    nickOcurrences[baseNick] = n;

    let index = players.indexOf(nick);
    if (index > -1) {
        players.splice(index, 1);
    }
}

function sanitizeNick(s) {
    if( typeof(s) !== 'string'
        || s.length > MAX_NICK_LEN
      ) 
            return false;
    s = s.trim();
    if(!(/^[a-zA-Z0-9]+$/.test(s)) ) return false;

    return s;    
}