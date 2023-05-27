import axiosService from "./axios-service"
import axios from "axios"

const axiosInstance = axiosService.getInstance()
const gameService = {
    get_games () { 
        return axiosInstance.get("/game", {}).then((res: { data: any }) => res.data)
    },

    get_games_by_username (username :string) { 
        return axiosInstance.get("/game/" + username, {  }).then((res: { data: any }) => res.data)
    },
}

export default gameService;
