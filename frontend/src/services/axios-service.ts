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
        // Response Interceptor
    this.axiosInstance.interceptors.response.use(
        function (response: any) {
            // Any status code that lies within the range of 2xx causes this function to trigger
            // Do something with response data
            return response;
        }, 
        function (error:any) {
            // Any status codes that fall outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response && error.response.status === 401) {
                // Handle 400 error
                authService.deleteToken();
                console.log("Logout")
                return Promise.resolve({ status: false }); // You can return a default value to handle the promise rejection
            }
            return Promise.reject(error);
        }
    );
        return this.axiosInstance;

    }

    getInstance(){
        return this.axiosInstance || this.initInstance;
    }
}

const axiosServiceInstance = new AxiosService();

export default axiosServiceInstance;