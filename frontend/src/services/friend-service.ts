import axiosService from "./axios-service"
import axios from "axios"

const axiosInstance = axiosService.getInstance()
export default {
    send_friend_request (id: number) { 
        return axiosInstance.post("/friend/sendrequest", { id }).then((res: { data: any }) => res.data)
    },
    remove_friendrequest (id: number) { 
    return axiosInstance.post("/friend/acceptrequest", { id }).then((res: { data: any }) => res.data)
    },
    find_friend () {
        return axiosInstance.get("/friend").then((res: { data: any}) => res.data)
    },
    remove_friend (friend_id :number) {
        return axiosInstance.post("/friend/remove", {friend_id}).then((res: {data :any}) => res.data)
    },
}