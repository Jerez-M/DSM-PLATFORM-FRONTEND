import axios from "axios";
import authHeader from "./services/auth-header.js";

export const apiUrl = "https://api-dev.brainstaketech.com/api/v1/";

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        ...authHeader(),
    },
});

export const formsRequestInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader(),
    },
});

export const googleBooksInstance = axios.create({
    baseURL: "https://www.googleapis.com/books/v1",
    headers: {
        "Content-Type": "application/json",
    },
})

export const googleBooksInstanceTest2 = axios.create({
    baseURL: "https://www.googleapis.com/books/v1",
    headers: {
        "Content-Type": "application/json",
    },
})

export default instance;
