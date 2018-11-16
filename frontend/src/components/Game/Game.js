import React, {Component} from 'react';

class Game extends Component {
    constructor(props) {
        super(props);
        
        this.roomId = props.match.params.id;
    }

    render() {
        return (
            <div>
                {JSON.stringify(this.props)}
                <h1>{this.roomId}</h1>
            </div>
        );
    }
}

export default Game;
