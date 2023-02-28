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

    getId() {
        return this.decode(this.getToken()).id;
    }

    getLogin() {
        return this.decode(this.getToken()).login;
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
}

export default new AuthService();