import axiosService from "./axios-service"
const axiosInstance = axiosService.getInstance()
export default {
  login (email :string, password :string) { 
	  return axiosInstance.post("/login", { email, password }).then((res: { data: any }) => res.data)
  },
    
  register (username :string, email :string ,password :string,) {
	  return axiosInstance.post("/user", { username, email, password }).then((res: { data: any }) => res.data)
  },
  
//   ({setRegister} : {setRegister :any})
//   confirm_email (token) {
//     return axiosInstance.post("/user/confirm", { token }).then(res => res.data)
//   },

//   modify_password ( login, key, password ) {
//     return axiosInstance.post("/password", { login , key, password }).then(res => res.data)
//   }
}