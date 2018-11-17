import React, {Component} from 'react';

import DataService from '../../services/DataService';

class GameRoom extends Component {
    constructor(props) {
        super(props);
        
        
        this.roomId = props.match.params.id;
        this.room = null;
    }
    componenDidMount() {
        DataService.getRoomById(this.roomId).then(room => this.room = room);
    }

    render() {
        return (
            <div>
                "dfwefewf"
            </div>
        );
    }
}

export default GameRoom;
