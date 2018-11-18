import openSocket from 'socket.io-client';
import CONFIG from '../Config';

class RealTimeService {
    static instance;

    constructor() {
        if(!RealTimeService.instance) {
            this.sock = openSocket(CONFIG.SOCKET_ENDPOINT);
            console.log(CONFIG.SOCKET_ENDPOINT);
            this.sock.on('connection', () => {
                console.log(Math.random()*10000)
            })

            RealTimeService.instance = this;
            Object.freeze(this);
        }
        return RealTimeService.instance;
    }
    static getInstance() {
        return new RealTimeService();
    }

    join = (room) => {
        this.sock.emit('join', room);
    }

    onChatMessage = (cb) => {
        this.sock.on('chat', cb);
    }

}
export default RealTimeService;