import instance, {formsRequestInstance} from "../http-common";

class LibraryEBooksService {
    getAllByInstitution(institutionId) {
        return instance.get(`/ebooks/get-all-ebooks-by-institution-id/${institutionId}/`)
    }

    getAllPastExamPapersByInstitution(institutionId) {
        return instance.get(`/ebooks/exam-papers/get-all-exam-papers-by-institution-id/${institutionId}/`)
    }

    getAllBySubject(subject, institutionId) {
        return instance.get(`/ebooks/get-all-ebooks-by-subject-name/${subject}/and-institution-id/${institutionId}/`)
    }

    getAllByDepartment(departmentId, institutionId) {
        return instance.get(`/ebooks/get-all-ebooks-by-department-id/${departmentId}/and-institution-id/${institutionId}/`)
    }

    getById(id) {
        return instance.get(`/ebooks/${id}/`)
    }

    findByTitle(institutionId, title) {
        return instance.get(`/ebooks/get-all-ebooks-by-institution-id/${institutionId}/and-title/${title}/`)
    }

    create(data) {
        return formsRequestInstance.post('/ebooks/', data)
    }

    update(id, data) {
        return formsRequestInstance.put(`/ebooks/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`/ebooks/${id}/`)
    }
}

export default new LibraryEBooksService();