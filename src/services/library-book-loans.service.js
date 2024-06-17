import instance from "../http-common";

class LibraryBookLoansService {
    getAllByInstitution(institutionId) {
        return instance.get(`libraries/library-book-loans/get-all-by-institution-id/${institutionId}/`)
    }

    getAllByLibrary(libraryId) {
        return instance.get(`libraries/library-book-loans/get-all-by-library/${libraryId}/`)
    }

    getAllByBook(bookId) {
        return instance.get(`libraries/library-book-loans/get-all-by-book-id/${bookId}/`)
    }

    getAllByUserId(userId) {
        return instance.get(`libraries/library-book-loans/get-all-by-borrower-user-id/${userId}/`)
    }

    getAllByRegNumber(regNumber) {
        return instance.get(`libraries/library-book-loans/get-all-by-borrower-registration-number/${regNumber}/`)
    }

    getById(id) {
        return instance.get(`libraries/library-book-loans/${id}/`)
    }

    create(data) {
        return instance.post('libraries/library-book-loans/', data)
    }

    update(id, data) {
        return instance.put(`libraries/library-book-loans/return-borrowed-book/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`libraries/library-book-loans/${id}/`)
    }
}

export default new LibraryBookLoansService();