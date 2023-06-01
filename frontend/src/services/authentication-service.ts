import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import axiosService from './axios-service';
import Cookies from 'js-cookie';

type JwtPayload = /*unresolved*/ any
class AuthService {
    key : any

    constructor() {
        this.key = 'auth_token';
    }

    verifyToken(token : string){
        return this.decode(token)
    }
    
    getToken() {
        return localStorage.getItem(this.key);
    }

    decode(token : string){
        return jwt.decode(token);
    }

    saveToken(token : string) {
        Cookies.set("isLogged", "true")
        return localStorage.setItem(this.key, token);
    }

    deleteToken(){
        Cookies.remove("isLogged")
        return localStorage.removeItem(this.key);
    }

    getExpiration(token : string){
        const decodedToken = this.decode(token) as JwtPayload;
        const exp = decodedToken ? decodedToken.exp : null;
        return moment.unix(exp);
    }

    // getId() {
    //     return this.decode(this.getToken()).id;
    // }
    getId() {
        // Check if the token exists
        const token = this.getToken()
        if (!token) {
          throw new Error("No token provided.");
        }
      
        // Decode the token
        const decodedToken = this.decode(token);
      
        // Check if the decoded token has an ID property
        if (typeof decodedToken === 'string') {
          throw new Error("Invalid token.");
        }
        if (!decodedToken || !decodedToken.id) {
          throw new Error("Invalid token.");
        }
      
        // Return the decoded ID
        return decodedToken.id;
      }
      

    getLogin() {
        const token = this.getToken()
        if (!token) {
          return null;
        }
        const decodedToken = this.decode(token);
        if (decodedToken === null) {

            return null;
        }
        if (typeof decodedToken === 'string') {
            return null;
        }
    
        return decodedToken.login;
        //return this.decode(this.getToken()).login;
    }

    getUsername() {
        const token = this.getToken();
        if (token) {
            const decodedToken = this.decode(token) as JwtPayload;

            if (decodedToken) {
                return decodedToken.username;
            }
        } else {
          return null; 
        }
    // return this.decode(this.getToken()).username;

}

    isLocal() {
        const token = this.getToken()
        if (!token) {
          return null;
        }
        const decodedToken = this.decode(token) as JwtPayload;

        if (decodedToken) {
            return decodedToken.username;
        }
    }

    isValid(token : string){
        return moment().isBefore(this.getExpiration(token));
    }

    isAuthentificated(){
        const token = this.getToken();
        return (token && this.isValid(token));
    }
   
}

const authServiceInstance = new AuthService();
export default authServiceInstance;