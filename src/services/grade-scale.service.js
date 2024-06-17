import instance from "../http-common";

class GradeScaleService {
    getAll(institutionId) {
        return instance.get(`/grading-scale/get-all-scales-by-tenant-id/${institutionId}`)
    }

    create(data) {
        return instance.post('/grading-scale/', data)
    }

    batchCreate(data) {
        return instance.post('/grading-scale/batch-create/', data)
    }

    update(id, data) {
        return instance.put(`/grading-scale/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`/grading-scale/${id}/`)
    }
}

export default new GradeScaleService();