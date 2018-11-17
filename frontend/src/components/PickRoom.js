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
        "orPickARoom": "... o elige una sala:"
    },
    'en': {
        "playNow": "Play Now!",
        "orPickARoom": "... or choose a room:"
    },
    'ro': {
        "playNow": "Joacă acum!",
        "orPickARoom": "... sau alegeți o sală:"
    }
};

_STRINGS['es'].__proto__ = _STRINGS['en'];
_STRINGS['ro'].__proto__ = _STRINGS['en'];


class PickRoom extends Component {

    constructor(props) {
        super(props);

        this.state = {rooms: []};
    }

    componentDidMount() {
        DataService.getRooms().then(rooms => {
            this.setState({rooms: rooms});
        });
    }
    
    /*handleClick = (e) => {
        e.preventDefault();

        this.props.onFinish(this.props.name);
    }*/

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