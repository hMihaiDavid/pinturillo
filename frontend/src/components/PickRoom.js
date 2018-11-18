import React, {Component} from 'react';
import { Link, Redirect } from 'react-router-dom';

import DataService from '../services/DataService';

import IMG_BACK_ARROW from '../assets/back-arrow.svg';

import IMG_LANG_RO from '../assets/ro.svg';
import IMG_LANG_ES from '../assets/es.svg';
import IMG_LANG_EN from '../assets/en.svg';

// TODO: REFACTOR THESE MAPPINGS OUT INTO A SERVICE
const LANG_TO_IMG = {
    'es': {src: IMG_LANG_ES, text: 'Español'},
    'en': {src: IMG_LANG_EN, text: 'English'},
    'ro': {src: IMG_LANG_RO, text: 'Română'}
};

const _STRINGS = {
    'es': {
        "playNow": "Jugar Ya!",
        "orPickARoom": "... o entra en una sala privada:",
        "roomCode": "Codigo de la sala...",
        "addNewPrivateRoom": "+ Nueva sala privada"
    },
    'en': {
        "playNow": "Play Now!",
        "orPickARoom": "... or join a private room:",
        "roomCode": "Room code...",
        "addNewPrivateRoom": "+ New private room"
    },
    'ro': {
        "playNow": "Joacă acum!",
        "orPickARoom": "... sau alegeți o sală privată:",
        "roomCode": "Codul salei...",
        "addNewPrivateRoom": "+ Nouă sală privată"
    }
};

_STRINGS['es'].__proto__ = _STRINGS['en'];
_STRINGS['ro'].__proto__ = _STRINGS['en'];


class PickRoom extends Component {

    constructor(props) {
        super(props);

        this.state = {code: ''};
        this.codeInputDOM = null;
    }

    componentDidMount() {
        DataService.getRooms().then(rooms => {
            this.setState({rooms: rooms});
        });

        this.codeInputDOM.focus();
    }
    
    /*handleClick = (e) => {
        e.preventDefault();

        this.props.onFinish(this.props.name);
    }*/

    handleChange = (evt) => {
        let s = evt.target.value.trim();
        if(s === '' || ( s.length <= 10 && /^[a-zA-Z0-9]+$/.test(s) ))
            this.setState({code: s.toUpperCase()});
    }

    handleSubmit = (evt) => {
        evt.preventDefault();
        console.log(this.state.code);
    }

    render() {
        if(!this.props.global.nick) return <Redirect to='/' />

        let STRINGS = _STRINGS[this.props.global.lang];

        let rooms = this.state.rooms;
        let langObj = LANG_TO_IMG[this.props.global.lang];

        return (
            <div>
                <div style={{display: 'flex', flexDirection:'row-reverse'}}>
                    <img src={langObj.src}
                        height={50} width={50}
                    />
                    <p style={{position:'relative', bottom: 15, marginRight:10}}>{langObj.text}</p>
                    
                    <div style={{width:'100%', textAlign:'center'}}>
                        <b><p>{this.props.global.nick}</p></b>
                    </div>
                    
                    <div style={{height:50, width:50, marginRight: 'auto' }}>
                        <Link to='/'>
                            <img src={IMG_BACK_ARROW} style={{height:50, width:50}} />
                        </Link>
                    </div>
                </div>

                <button style={{display: 'block ', backgroundColor: 'green'}} 
                        className='center-horizontal'>
                    {STRINGS["playNow"]}
                </button>
                
                <p style={{textAlign: "center"}}>{STRINGS['orPickARoom']}</p>

                <form onSubmit={this.handleSubmit}>
                    <div style={{display: 'flex'}} className='center-horizontal'>
                        <input type='text' value={this.state.code} onChange={this.handleChange} className='main-input'
                            placeholder={STRINGS['roomCode']}  ref={e => this.codeInputDOM = e} />
                        <button type='submit' 
                                style={{display: 'block ', backgroundColor: 'blue', margin:20, width:100}} 
                                disabled={this.state.code === ''}
                                className='center-horizontal'>
                            {'>'}
                        </button>
                    </div>
                </form>

                <button style={{marginTop: 60}}>
                    {STRINGS['addNewPrivateRoom']}
                </button>
            </div>
        );
    }

    /* 
     {rooms.map(room => 
                        <li key={room.id}><Link to={`/rooms/${room.id}`}>{room.name}</Link></li>
                    )}
    */
}
export default PickRoom;