import instance from "../http-common";

class LibraryBooksService {
    getAllByInstitution(institutionId) {
        return instance.get(`libraries/library-books/get-all-by-institution-id/${institutionId}/`)
    }

    getAllByLibrary(libraryId) {
        return instance.get(`libraries/library-books/get-all-by-library-id/${libraryId}/`)
    }

    getById(id) {
        return instance.get(`libraries/library-books/${id}/`)
    }

    create(data) {
        return instance.post('libraries/library-books/', data)
    }

    update(id, data) {
        return instance.put(`libraries/library-books/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`libraries/library-books/${id}/`)
    }
}

export default new LibraryBooksService();