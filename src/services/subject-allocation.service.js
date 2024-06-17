import instance from "../http-common";

class SubjectAllocationService {
    create(data) {
        return instance.post('/subject-allocation/batch-create-subject-allocation/', data);
    }

    getSubjectAllocationByInstitutionId(tenantId) {
        return instance.get(`/subject-allocation/get-by-institution-id/${tenantId}/`)
    }

    getSubjectAllocationByTeacherUserId(teacherId) {
        return instance.get(`/subject-allocation/get-by-teacher-user-id/${teacherId}/`)
    }

    getsubjectAllocationByTeacherId(schoolId, teacherId) {
        return instance.get(`/subject-class/get-all-by-schoolId-teacherId?schoolId=${schoolId}&teacherId=${teacherId}`)

    }
    getsubjectAllocationByUserId(userId) {
        return instance.get(`/subject-allocation/get-by-teacher-user-id/${userId}/`)

    }

    getStudentSubjectByUserId(userId) {
        return instance.get(`/students/get-student-subjects-by-student-user-id/${userId}`)

    }

    getsubjectAllocationByLevelId(levelId) {
        return instance.get(`/subject-class/get-all-by-level/${levelId}`)
    }
    updatesubjectAllocation(subjectAllocationId, data){
        return instance.put(`/subject-allocation/${subjectAllocationId}/`,data)
    }

    deletesubjectAllocation(id){
        return instance.delete(`/subject-class/${id}`)
    }

    getTeacherPreviousSubjectAllocations(id) {
        return instance.get(`/subject-allocation/get-previous-teacher-classrooms-by-teacher-user-id/${id}`)
    }
}

export default new SubjectAllocationService();