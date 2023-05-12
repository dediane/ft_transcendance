import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

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
        return localStorage.setItem(this.key, token);
    }

    deleteToken(){
        return localStorage.removeItem(this.key);
    }

    getExpiration(token : string){
        const exp = this.decode(token).exp;
        return moment.unix(exp);
    }

    // getId() {
    //     return this.decode(this.getToken()).id;
    // }
    getId() {
        // Check if the token exists
        if (!this.getToken()) {
          throw new Error("No token provided.");
        }
      
        // Decode the token
        const decodedToken = this.decode(this.getToken());
      
        // Check if the decoded token has an ID property
        if (!decodedToken || !decodedToken.id) {
          throw new Error("Invalid token.");
        }
      
        // Return the decoded ID
        return decodedToken.id;
      }
      

    getLogin() {
        return this.decode(this.getToken()).login;
    }

    getUsername() {
        return this.decode(this.getToken()).username;
    }

    isLocal() {
        return this.decode(this.getToken()).local;
    }

    isValid(token : string){
        return moment().isBefore(this.getExpiration(token));
    }

    isAuthentificated(){
        const token = this.getToken();
        return (token && this.isValid(token));
    }
    getUsername() {
        return this.decode(this.getToken()).username;
    }
}

export default new AuthService();