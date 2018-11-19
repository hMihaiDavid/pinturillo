import openSocket from 'socket.io-client';
import CONFIG from '../Config';

class RealTimeService {
    static instance;

    constructor() {
        if(!RealTimeService.instance) {
            this.sock = openSocket(CONFIG.SOCKET_ENDPOINT);
            console.log(CONFIG.SOCKET_ENDPOINT);
            this.sock.on('disconnect', () => {
                alert("You have been disconnected from the server.")
            })

            RealTimeService.instance = this;
            Object.freeze(this);
        }
        return RealTimeService.instance;
    }
    static getInstance() {
        return new RealTimeService();
    }

    join(roomId, nick, cb) {
        
        this.sock.emit('join', roomId, nick);
        this.sock.on('join rep', cb)
    }

    onChatMessage(cb) {
        this.sock.on('chat', cb);
    }

    sendChatMessage(txt) {
        this.sock.emit('chat', String(txt));
    }

    onCanvasAction(cb) {
        this.sock.on('pendown', (pos) => cb('pendown', pos));
        this.sock.on('penup', (pos) => cb('penup', pos) );
        this.sock.on('stroke', (pos) => { cb('stroke', pos); });
        this.sock.on('clear', () => cb('clear'));

    }

    mouseUp(pos) {
        this.sock.emit('penup',pos);
    }

    mouseDown(pos) {
        this.sock.emit('pendown', pos)
    }

    stroke(pos) {
        this.sock.emit('stroke', pos);
    }

    clear() {
        this.sock.emit('clear');
    }

}
export default RealTimeService;