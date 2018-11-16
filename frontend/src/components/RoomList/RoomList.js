import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RoomList extends Component {
    constructor(props) {
        super(props);

        this.state = {rooms: []};
    }

    componentDidMount() {
        setTimeout(()=>{
            this.setState({rooms: [{roomId: 'nepe1'}, {roomId: 'nepe2'}]});
        }, 2000);
        //fetch('')
    }

    render() {
        return (
            <RoomListView rooms={this.state.rooms} />
        );
    }
}

class RoomListView extends Component {
    render() {
        let rooms = this.props.rooms || [];
        console.log(rooms);

        return (
            <div>
                <ul>
                    {rooms.map((room) => 
                    <li key={room.roomId}>
                        <Link to={`/room/${room.roomId}`}>{room.roomId}</Link>
                    </li> )}
                </ul>
            </div>
        );
    }
}

export default RoomList;
