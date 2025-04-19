import axios from "axios";

export default class PostService {

    static async getAllResidents() {
        const response = await axios.get('http://127.0.0.1:8000/management/residents/residents/');
        return response.data.data;
    }

    static async createResident(residentData) {
        const response = await axios.post('http://127.0.0.1:8000/management/residents/residents/', residentData);
        return response.data.data;
    }
    static async getAllRooms() {
        const response = await axios.get('http://127.0.0.1:8000/management/rooms/rooms/');
        return response.data.data;
    }

    static async getAllBlocks() {
        const response = await axios.get('http://127.0.0.1:8000/management/blocks/blocks/');
        return response.data.data;
    }

    static async getAllFloors() {
        const response = await axios.get('http://127.0.0.1:8000/management/floors/floors/');
        return response.data.data;
    }

    static async getBlocksByFloorId(floorId) {
        const response = await axios.get(`http://127.0.0.1:8000/management/floors/floors/${floorId}/blocks/`);
        return response.data.data;
    }

    static async createRoom(roomData) {
        const response = await axios.post('http://127.0.0.1:8000/management/rooms/rooms/', roomData);
        return response.data.data;
    }

    static async getUpdatedRooms() {
        const response = await axios.get('http://127.0.0.1:8000/management/available_rooms/');
        return response.data.data;
    }

    static async getResidentsNoRoom() {
        const response = await axios.get('http://127.0.0.1:8000/management/residents/residents/no-room');
        return response.data.data;
    }


}


