import instance, {formsRequestInstance} from "../http-common";

class StudentService {
    getAllStudentsByInstitutionId(id) {
        return instance.get(`/students/get-all-students-by-institution-id/${id}/`);
    }

    getAllStudentsByLevel(id) {
        return instance.get(`/students/get-students-by-level-id/${id}/`);
    }

    getTotalNumberOfStudentsByInstitutionId(id) {
        return instance.get(`students/get-total-number-of-students-by-institution/${id}/`)
    }

    getStudentsGenderRatioByInstitutionId(id) {
        return instance.get(`students/get-students-gender-ratio-by-institution/${id}/`)
    }

    getStudentByUserId() {
        return instance.get(`students/get-student-by-user-id/`)
    }

    getStudentByTheUserId(user_id) {
        return instance.get(`students/get-student-by-user-id/${user_id}/`)
    }

    get(id) {
        return instance.get(`/students/${id}/`);
    }

    create(data) {
        return instance.post("students/", data);
    }

    update(studentId, data) {
        return instance.put(`/students/${studentId}/`, data);
    }

    delete(userId) {
        return instance.delete(`/students/${userId}/`);
    }

    bulkDelete(userIds) {
        return instance.delete(`/students/bulk-delete-students/`, { data: userIds });
    }

    bulkUpload(tenantId, data) {
        return formsRequestInstance.postForm(`students/students-bulk-upload/${tenantId}/`, data)
    }

    bulkUploadByClass(tenantId, classroomId, data) {
        return formsRequestInstance.postForm(`students/students-bulk-upload-by-class/${tenantId}/classroom/${classroomId}/`, data)
    }

    getAllByClassAndYear(tenant, classId, academicYearId) {
        return instance.get(`students/get-students-by-tenant-id-classroom-id-academic-year-id/${tenant}/${classId}/${academicYearId}/`)
    }

    uploadStudentDocument(id, data) {
        return formsRequestInstance.postForm(`students/upload-student-birth-certificate/${id}/`, data)
    }

    getStudentDocument(id) {
        return instance.get(`students/get-student-birth-certificate/${id}/`)
    }

    searchUserByRegNumber(regNumber) {
        return instance.get(`students/get-student-by-reg-number/${regNumber}/`)
    }

    getTotalNumberOfStudents() {
        return instance.get('students/get-total-number-of-students/')
    }

    getStudentBirthCertificateById(id) {
        return instance.get(`students/get-student-birth-certificate/${id}/`)
    }

    promoteStudents(data) {
        return instance.post(`students/promote-students/`, data)
    }

    addStudentToParent(data) {
        return instance.post(`students/add-student-to-parent-student-list/`, data)
    }

    getChildrenOfParent(id) {
        return instance.get(`students/get-students-by-parent-user-id/${id}/`)
    }

    promoteAllStudentsByInstitutionId(id) {
        return instance.post(`students/promote-all-students-by-institution-id/${id}/`)
    }
}

export default new StudentService();
