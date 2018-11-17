import React, {Component} from 'react';
import PickNick from './PickNick';
import PickRoom from './PickRoom';

class StartGame extends Component {
    constructor(props) {
        super(props);

        this.state = {stage: 'pickNick'};

    }

    nextStage = (finishedStageName, ) => {
        if(finishedStageName === 'pickNick') {
            this.setState({stage: 'pickRoom'});
        } else if(finishedStageName === 'pickRoom') {
            console.log("FINISHED STARTGAME");
        }
    }

    render() {
        let element;
        if(this.state.stage === 'pickNick') {
            element = <PickNick name='pickNick' onFinish={this.nextStage} global={this.props.global} />
        } else if (this.state.stage === 'pickRoom') {
            element = <PickRoom name='pickRoom' onFinish={this.nextStage} />
        }

        return (
            <div>
                {element}
            </div>
        );
    }
}


export default StartGame;
