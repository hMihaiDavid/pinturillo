import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';

import TheCanvas from './TheCanvas';

import DataService from '../../services/DataService';
import RealTimeService from '../../services/RealTimeService';

class GameRoom extends Component {
    constructor(props) {
        super(props);
        this.rtService = new RealTimeService();
        
        this.state = {chatInput: '', chatMessages: [], users: []};
        let chatMessagesDOM;
        
    }
    componenDidMount() {
        this.rtService.join(this.props.global.nick, this.props.match.params.id);       
    }

    componentDidUpdate() {
        this.chatMessagesDOM.scrollTop = this.chatMessagesDOM.scrollHeight;
    }
    handleChange = evt => {
        let s = evt.target.value;
        this.setState({chatInput: s});
    }

    handleChatKeyPress = evt => {
        if(evt.key === 'Enter') {
            let s = this.state.chatInput.trim();
            if(s==='') return;
            let msg = {type:'msg', text: s, from: this.props.global.nick};
            this.appendMessageToChat(msg);
        }
    }

    render() {
    //if(!this.props.global.nick) return <Redirect to='/' />

        let chatMessages = this.state.chatMessages;

        return (
            <div>
                <div style={{display:'flex', flexDirection: 'row'}}>
                    <div style={{display:'flex', flexDirection: 'column'}}>
                        <TheCanvas
                        width={800} height={400}>
                        </TheCanvas>
                        <div style={{border:'1px solid black', marginTop: 10, height:'99%', maxHeight:'99%', maxWidth:800}}>
                            ESTADÍSTICAS DE LOS USUARIOS
                        </div>
                    </div>
                    <div style={{border: '1px solid black', height: 480, width: '99%', marginLeft:10 }}> {/*chat*/}
                        <div className='chat-messages' ref={e => this.chatMessagesDOM = e}>
                            {GameRoom.mapChatMessagesToHTML(chatMessages)}
                        </div>
                        <input className='chat-input'
                            type='text' value={this.state.chatInput} onChange={this.handleChange} 
                            onKeyPress={this.handleChatKeyPress}/>
                    </div> 
                </div>
            </div>
        );
    }

    appendMessageToChat(msg) {
        if(msg.type === 'msg')
            msg.color = GameRoom.colorHash(msg.from);
        this.setState((state) => {  
            state.chatMessages.push(msg);
            state.chatInput = '';
            return state;
        });
    }

    static mapChatMessagesToHTML(messages) {
        return messages.map(msg => {
            if(msg.type === 'msg') {
                if(!msg.from) msg.from = 'Mike'; // TODO REMOVE THIS
                return <div><span style={{color: msg.color}}
                                ><b>{`${msg.from}: `}</b></span><span>{msg.text}</span></div>                
            }
            else if(msg.type === 'ctrl')
                return <p>TODO: HANDLE SERVER INFO</p>
        })
    }

    static _hashCode(str) {
        let hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
      }
      
    static colorHash(str) {
        // Note the last value here is now 50% instead of 80%
        return `hsl(${GameRoom._hashCode(str) % 360}, 100%, 40%)`;
      }
}

export default GameRoom;
