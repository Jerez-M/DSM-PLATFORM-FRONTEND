import instance from "../http-common";

class EndTermPaperService {

    create(data) {
        return instance.post('end-term-papers/', data)
    }

    update(id, data) {
        return instance.put(`end-term-papers/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`end-term-papers/${id}/`)
    }

    getAllByEndTermExam(id) {
        return instance.get(`end-term-papers/get-end-term-papers-by-exam-id/${id}/`)
    }
}

export default new EndTermPaperService();