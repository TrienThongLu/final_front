import axios from "axios";

// axios.defaults.baseURL = process.env.VUE_APP_API_URL || "https://localhost:7096";

const mainAxios = axios.create({
    baseURL: 'https://localhost:7096'
});

const customAxios = axios.create({
    baseURL: '/distance'
});

export default {
    mainAxios,
    customAxios
}

// export default axios.create();
