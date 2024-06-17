import instance, {formsRequestInstance} from "../http-common";

class TeacherService {
    create(data) {
        return instance.post(`/teachers/`, data);
    }

    get(id) {
        return instance.get(`teachers/${id}/`)
    }

    getAllTeachersByInstitutionId(id) {
        return instance.get(`/teachers/get-all-teachers-by-institution-id/${id}/`);
    }

    getTotalNumberOfTeachersByInstitutionId(id) {
        return instance.get(`teachers/get-total-number-of-teachers-by-institution/${id}/`)
    }

    getTeachersGenderRatioByInstitutionId(id) {
        return instance.get(`teachers/get-teachers-gender-ratio-by-institution/${id}/`)
    }

    getTeacherByUserId(userId) {
        return instance.get(`/teachers/get-teacher-by-user-id/${userId}/`);
    }

    update(teacherId, data) {
        return instance.put(`/teachers/${teacherId}/`, data);
    }

    delete(teacherId) {
        return instance.delete(`/teacher/${teacherId}/`);
    }

    deleteAll() {
        return instance.delete(`/teacher`);
    }

    findByTitle(title) {
        return instance.get(`/teachers?title=${title}`);
    }

    getTotalNumberOfStudentsTaughtByTeacher(teacherId) {
        return instance.get(`/teachers/get-number-of-students-taught-by-teacher/${teacherId}/`);
    }

    getTotalNumberOfClassroomsByTeacher(teacherId) {
        return instance.get(`/teachers/get-number-of-students-taught-by-teacher/${teacherId}/`);
    }

    getTeacherStats(tenantId, userId) {
        return instance.get(`/teachers/get-teacher-stats-by-teacher-id/${tenantId}/${userId}/`);
    }

    bulkUpload(tenantId, data) {
        return formsRequestInstance.postForm(`teachers/teachers-bulk-upload/${tenantId}/`, data)
    }

    searchUserByRegNumber(regnumber) {
        return instance.get(`/teachers/get-by-teacher-reg-number/${regnumber}/`);
    }
}

export default new TeacherService();
