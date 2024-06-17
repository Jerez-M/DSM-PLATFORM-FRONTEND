import {googleBooksInstance} from "../http-common";

class GoogleBooksApi {
    findByIsbn(isbn) {
        return googleBooksInstance.get(`/volumes?q=isbn:${isbn}`)
    }
}

export default new GoogleBooksApi();