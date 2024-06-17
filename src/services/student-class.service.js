import instance from "../http-common";

class StudentClassService {
    getAll(id) {
        return instance.get(`/student-class/get-classroom-by-institution-id/${id}/`);
    }

    getStudentsByClass(classId, instituteId) {
        return instance.get(`/student-class/get-students-by-classroom-id/${classId}/${instituteId}`)
    }

    getClassByTeacher(teacherId) {
        return instance.get(`/student-class/get-by-teacher-id/${teacherId}/`)
    }
    getClassByUserId(userId) {
        return instance.get(`/student-class/get-by-user-id/${userId}/`)
    }
    getStudentClassByStudentUserId(studentUserId) {
        return instance.get(`/student-class/get-student-classroom-by-student-user-id/${studentUserId}/`)
    }
    getStudentSubjectsByStudentUserId(studentUserId) {
        return instance.get(`/student-class/get-student-subjects-by-student-user-id/${studentUserId}/`)
    }

    create(data) {
        return instance.post("/student-class/", data)
    }

    removeStudentFromClass(userId, classId) {
        return instance.delete(`/student-class/remove-student-from-class-by-student-id/student/${userId}/classroom/${classId}/`)
    }

    removeStudentFromClassByStudentId(studentId) {
        return instance.delete(`/student-class/remove-student-from-class-by-student-id/${studentId}/`)
    }
    removeBulkStudentsFromClass(requestData) {
        return instance.delete(`/student-class/bulk-remove-student-from-class/`, requestData)
    }

    update(id, data) {
        return instance.put(`/student-class/${id}`, data)
    }

    delete(id) {
        return instance.delete(`/student-class/${id}`)
    }

    getAllByClassAndYear(tenant, classId, academicYearId) {
        return instance.get(`student-class/get-students-by-tenant-id-classroom-id-academic-year-id/tenant/${tenant}/classroom/${classId}/academic-year/${academicYearId}/`)
    }

    getStudentPreviousClasses(userId) {
        return instance.get(`student-class/get-student-previous-classes-by-student-user-id/${userId}/`)
    }

    getAllPreviousClasses(classId) {
        return instance.get(`class-rooms/get-previous-classroom-by-classroom-id/${classId}/`)
    }
}

export default new StudentClassService();