import instance from "../http-common";

class SubjectService {
    getAll(tenantId) {
        return instance.get(`/subjects/get-subjects-by-institution-id/${tenantId}/`);
    }

    get(id) {
        return instance.get(`/subject/${id}`);
    }

    getTotalNumberOfSubjectsByInstitutionId(id) {
        return instance.get(`subjects/get-total-subjects-by-institution-id/${id}/`)
    }

    getSubjectNameAndLevel(id) {
        return instance.get(`subject/subjectName-level/?id=${id}`)
    }

    getTotalSubjectsByUserId(userId) {
        return instance.get(`/subject/${userId}`);
    }

    getSubjectByTeacherUserName(userName) {
        return instance.get(`/subject/${userName}`);
    }

    getSubjectByUserId(userId) {
        return instance.get(`/subject/get-by-userId/${userId}`);
    }
    create(data) {
        return instance.post("/subjects/", data);
    }

    getSubjectBySubjectNameAndLevel(subjectName, level) {
        return instance.get(
            `/subject/subjectName-level/?subjectName=${subjectName}&level=${level}`
        );
    }

    update(id, data) {
        return instance.put(`/subjects/${id}/`, data);
    }

    delete(id) {
        return instance.delete(`/subjects/delete/${id}`);
    }

    deleteAll() {
        return instance.delete(`/subject`);
    }

    findByTitle(title) {
        return instance.get(`/subjects?title=${title}`);
    }

    getSingleTeacherSubjects(id, teacherUsername) {
        return instance.get(`/subject/teacher-name/?teacherUserName=${teacherUsername}&id=${id}`);
    }
}

export default new SubjectService();