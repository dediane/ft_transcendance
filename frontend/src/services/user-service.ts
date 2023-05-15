import axiosService from "./axios-service"
import axios from "axios"
import authenticationService from "./authentication-service"
const axiosInstance = axiosService.getInstance()
export default {
  login (email :string, password :string) { 
	  return axiosInstance.post("/auth/login", { email, password }).then((res: { data: any }) => res.data)
  },
    
  register (username :string, email :string ,password :string) {
	  return axiosInstance.post("/user", { username, email, password }).then((res: { data: any }) => res.data)
  },

  activate2fa(twoFactorAuthenticationCode :string) {
    return axiosInstance.post("auth/2fa/turn-on", { twoFactorAuthenticationCode }).then((res: { data: any }) => res.data)
  },

  disable2fa(twoFactorAuthenticationCode :string) {
    return axiosInstance.post("auth/2fa/turn-off", { twoFactorAuthenticationCode }).then((res: { data: any }) => res.data)
  },

  generate2fa() {
    return axiosInstance.post("auth/2fa/generate").then((res: { data: any }) => res.data)
  },

  authenticate2fa(twoFactorAuthenticationCode :string) {
    return axiosInstance.post("auth/2fa/authenticate", { twoFactorAuthenticationCode }).then((res: { data: any }) => res.data)
  },
  
  finduser () {
	  return axiosInstance.get("/user", {}).then((res: { data: any }) => res.data)
  },

  findPublicUser (username :string) {
	  return axiosInstance.post("/user/username/", {username}).then((res: { data: any }) => res.data)
   },

  profile () {
	  return axiosInstance.get("/user/profile", {}).then((res: { data: any }) => res.data)
  },
  
  login42 () {
    return axios.get("http://localhost:8000/auth/42", {})
  },

  search (input :string) {
	  return axiosInstance.get("/search/" + input).then((res: { data: any }) => res.data)
  },

  add_friend (friend_id :number) {
    return axiosInstance.post("/friend/add", {friend_id}).then((res: { data: any }) => res.data)
  },

  remove_friend (friend_id :number) {
    return axiosInstance.post("/friend/remove", {friend_id}).then((res: {data :any}) => res.data)
  },

  find_friend () {
    return axiosInstance.get("/friend").then((res: { data: any}) => res.data)
  },

  async avatar (img_base64: string) {
    return axiosInstance.post("/user/avatar", {img_base64}).then((res: { data: any }) => res.data)
  },
}

  //Create42 route GET /auth/42 
  //here ->



//   ({setRegister} : {setRegister :any})
//   confirm_email (token) {
//     return axiosInstance.post("/user/confirm", { token }).then(res => res.data)
//   },

//   modify_password ( login, key, password ) {
//     return axiosInstance.post("/password", { login , key, password }).then(res => res.data)
//   }
