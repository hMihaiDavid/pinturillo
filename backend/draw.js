module.exports = {init: init};

let io;
let rooms;

const MAX_NICK_LEN = 30;

function init(_io, _rooms) {
    io = _io;
    rooms = _rooms;

    io.on('connection', handleConnection);
}

let handleConnection =  (sock) => {
    console.log('[DEBUG] connected sockid:',sock.id);
    let conn = {sock: sock}; /* this will represent the state of this conneciton. 
                                it will have more things inserted in it. */

    sock.on('disconnect', handleDisconnect);
    sock.on('join', handleJoin);
}

function handleDisconnect() {
    console.log('[DEBUG] disconnect sockid:',this.sock.id)
}

function handleJoin(nick, roomId) {

    // Input validation and sanity checks...
    if( typeof(roomId) !== 'string' && roomId.length > 20) 
        this.disconnect();
    let room = rooms[roomId];
    nick = sanitizeNick(nick);
    if(!nick) this.disconnect();

    if(!room) {
        this.emit('join rep', {error:1, msg:"Room does not exist."});
        return;
    }

    if(room.players.length === room.maxPlayers) {
        this.emit('join rep', {error:2, msg: "Room is full", maxPlayers: room.maxPlayers});
        return;
    }

    // if the nick is already taken, add a number to it, mik#2, mike#3 ...
    nick = getActualNick(nick, room);
    room.players.push(nick);
    

    this.join(room.id+'/data');
    this.join(room.id+'/chat');
    this.emit('join rep', {ok: 1});
}

/* precondition: nick is a sanitized nick string. */
function getActualNick(nick, room) {
    let nickOcurrences = room.nickOcurrences;
    let actualNick = nick;

    let n = nickOcurrences[nick];
    if(!n) n = 1;
    else  {
        n++;
        actualNick = nick+'#'+n;
    }

    nickOcurrences[nick] = n;
    return actualNick;
}

function sanitizeNick(s) {
    if( typeof(s) !== 'string'
        || s.length > MAX_NICK_LEN
      ) 
            return false;
    s = s.trim();
    if(!/^a-zA-Z0-9$/.test(s)) return false;

    return s;    
}