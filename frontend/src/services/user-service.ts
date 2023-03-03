import axiosService from "./axios-service"
import axios from "axios"

const axiosInstance = axiosService.getInstance()
export default {
  login (email :string, password :string) { 
	  return axiosInstance.post("/auth/login", { email, password }).then((res: { data: any }) => res.data)
  },
    
  register (username :string, email :string ,password :string) {
	  return axiosInstance.post("/user", { username, email, password }).then((res: { data: any }) => res.data)
  },
  
  finduser () {
	  return axiosInstance.get("/user", {}).then((res: { data: any }) => res.data)
  },
  profile () {
	  return axiosInstance.get("/user/profile", {}).then((res: { data: any }) => res.data)
  },
  
  login42 () {
    return axios.get("http://localhost:8000/auth/42", {})
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
}