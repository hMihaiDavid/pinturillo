import React, {Component} from 'react';
import { Redirect, Link } from 'react-router-dom';

import IMG_LANG_RO from '../assets/ro.svg';
import IMG_LANG_ES from '../assets/es.svg';
import IMG_LANG_EN from '../assets/en.svg';

const IMG_LANG = [
    {code: 'es', src: IMG_LANG_ES, alt: 'Español'},
    {code: 'en', src: IMG_LANG_EN, alt: 'English'},
    {code: 'ro', src: IMG_LANG_RO, alt: 'Română'},
];

const _STRINGS = {
    'es': {
        nickInputPlaceholder: "Nombre...",
        selectYourLanguage: "Elige tu idioma..."
    },
    'en': {
        nickInputPlaceholder: "Nick...",
        selectYourLanguage: "Choose your language..."
    },
    'ro': {
        selectYourLanguage: "Alegeți limba..."
    }
};

_STRINGS['es'].__proto__ = _STRINGS['en'];
_STRINGS['ro'].__proto__ = _STRINGS['en'];


class PickNick extends Component {

    constructor(props) {
        super(props);
        this.nickInputDOM = null;
        
        this.state = {
            nick: global.nick || '',
            lang: this.props.global.lang,
            toRooms: false
        };
    }

    componentDidMount() {
        this.nickInputDOM.focus();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        
        this.props.global.setNick(this.state.nick);
        this.setState({toRooms: true});
        //this.props.history.push('/rooms');
    }

    handleChange = (e) => {
        let s = e.target.value.trim();
        if(s === '' || ( s.length <= 20 && /^[a-zA-Z0-9]+$/.test(s) ))
            this.setState({nick: s});
    }

    setLang = (lang) => {
        this.setState({lang: lang});
        this.props.global.setLang(lang);
    }

    handleLangClick = (evt, lang) => {
        evt.preventDefault(); 
        this.setLang(lang.code);
        this.nickInputDOM.focus();
    }
    
    render() {
        if(this.state.toRooms) return <Redirect to='/rooms'/>

        let STRINGS = _STRINGS[this.props.global.lang];
        return (
            <div className="center">
                <p>{ STRINGS['selectYourLanguage'] }</p>
                <div className='lang-select-container'>
                    {
                        //TODO refactor the CSS
                        IMG_LANG.map( (l) => 
                            <a href='#' onClick={(evt) => this.handleLangClick(evt, l)}>
                                <img src={l.src}  alt={l.alt} width={80} height={80} 
                                style={{
                                        margin: 10, 
                                        border: this.props.global.lang === l.code? '8px solid black':'', 
                                        borderRadius:100}} 
                            />
                            </a>
                        )
                    }
                </div>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' placeholder={STRINGS['nickInputPlaceholder']} className='main-input'
                     onChange={this.handleChange} value={this.state.nick} 
                     ref={(e) => this.nickInputDOM = e } />
                <button type='submit'
                    disabled={this.state.nick == ''}
                > ></button>
                </form>
            </div>
        );
    }
}

export default PickNick;