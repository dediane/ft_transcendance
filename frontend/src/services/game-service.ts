import axiosService from "./axios-service"
import axios from "axios"

const axiosInstance = axiosService.getInstance()
export default {
    get_games () { 
        return axiosInstance.get("/game", {}).then((res: { data: any }) => res.data)
    },
}