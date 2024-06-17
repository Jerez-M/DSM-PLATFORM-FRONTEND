import instance from "../http-common";

class InstitutionOwnerService {
    suspend(data, studentId) {
        return instance.post(`/suspensions/suspend/${studentId}/`, data)
    }

    unsuspend(data, studentId) {
        return instance.put(`/suspensions/unsuspend/${studentId}/`, data)
    }

    transfer(data, studentId) {
        return instance.put(`/students/transfer/${studentId}/`, data)
    }

    update(id) {
        return instance.put(`/${id}/`)
    }
    expel(data, studentId) {
        return instance.post(`/expulsions/expel/${studentId}/`, data)
    }

    getAll() {
        return instance.get('/')
    }
}

export default new InstitutionOwnerService();
