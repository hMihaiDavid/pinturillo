

class DataService {

    static DELAY = 100;
    
    static MOCK_ROOMS = [
        {name: "XD", id:1,  players:0, maxplayers: 4},
        {name: "LOL", id:2,  players:0, maxplayers: 4},        
    ];

    static getRooms() {
        // fetch...
        return new Promise((resolve, reject) => {
            setTimeout(()=>resolve(DataService.MOCK_ROOMS), this.DELAY);
        });
    }

    static getRoomById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(()=> resolve(this.MOCK_ROOMS.find(r => r.id === id))
            , this.DELAY);
        });
    }
}

export default DataService;