import axios from 'axios';
import authService from './authentication-service';

class AxiosService {
    axiosInstance : any
    constructor() {
        this.axiosInstance = {};
        this.initInstance();
    }
    initInstance() {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8000/',
            timeout: 5000
        })
    this.axiosInstance.interceptors.request.use(
        (config : any) => {
            const token = authService.getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        return this.axiosInstance;
    }

    getInstance(){
        return this.axiosInstance || this.initInstance;
    }
}

const axiosServiceInstance = new AxiosService();

export default axiosServiceInstance;