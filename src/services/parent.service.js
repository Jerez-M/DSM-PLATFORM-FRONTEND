import instance from "../http-common";

class ParentService {
    create(data) {
        return instance.post('/parents/', data)
    }

    getParentByStudentId(studentUserId) {
        return instance.get(`/parents/get-all-parents-by-student-id/${studentUserId}/`)
    }

    getParentByInstitutionId(tenantId) {
        return instance.get(`/parents/get-all-parents-by-institution-id/${tenantId}/`)
    }

    getTotalParentsByInstitutionId(tenantId) {
        return instance.get(`/parents/get-total-number-of-parents-by-institution/${tenantId}/`)
    }

    getParentByUserId(userId) {
        return instance.get(`/parents/get-parent-by-user-id/${userId}/`)
    }

    get(id) {
        return instance.get(`/parents/${id}/`)
    }

    getParent(id) {
        return instance.get(`/parents/get/${id}/`)
    }

    update(id, data) {
        return instance.put(`/parents/${id}/`, data)
    }
}

export default new ParentService(); 