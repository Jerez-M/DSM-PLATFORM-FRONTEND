import instance, {formsRequestInstance} from "../http-common";

class CourseworkService {
    create(data) {
        return instance.post(`/coursework/`, data);
    }

    uploadCourseworkFile(courseworkId, data) {
        return formsRequestInstance.postForm(`/coursework/upload-coursework-file/${courseworkId}/`, data);
    }

    getById(id) {
        return instance.get(`/coursework/${id}/`);
    }

    getAllByTeacherId(teacherId) {
        return instance.get(`/coursework/get-all-coursework-by-teacher-id/${teacherId}/`);
    }

    getAllByClassroomId(classroom_id) {
        return instance.get(`/coursework/get-all-coursework-by-classroom-id/${classroom_id}/`);
    }

    getAllByClassroomIdAndTermId(classroom_id, term_id) {
        return instance.get(`/coursework/get-all-coursework-by-classroom-id/${classroom_id}/and-term-id/${term_id}/`);
    }

    getAllByUserId(user_id) {
        return instance.get(`/coursework/get-all-coursework-by-user-id/${user_id}/`);
    }

    getAllByUserIdAndTermId(user_id, term_id) {
        return instance.get(`/coursework/get-all-coursework-by-user-id/${user_id}/and-term-id/${term_id}/`);
    }

    getAllByInstitution(institutionId) {
        return instance.get(`/coursework/get-all-coursework-by-institution-id/${institutionId}/`);
    }

    getAllByInstitutionIdAndTermId(institutionId, term_id) {
        return instance.get(`/coursework/get-all-coursework-by-institution-id/${institutionId}/and-term-id/${term_id}/`);
    }

    update(id, data) {
        return instance.put(`/coursework/update/${id}/`, data);
    }

    delete(id) {
        return instance.delete(`/coursework/${id}/`);
    }
}

export default new CourseworkService();