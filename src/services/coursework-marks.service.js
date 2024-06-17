import instance, {formsRequestInstance} from "../http-common";

class CourseworkMarkService {
    create(data) {
        return formsRequestInstance.post(`/coursework/coursework-marks/`, data);
    }

    bulkUploadMarks(data) {
        return instance.post(`/coursework/coursework-marks/bulky-upload/`, data);
    }

    getById(id) {
        return instance.get(`/coursework/coursework-marks/${id}/`);
    }

    getAllByCourseworkId(coursework_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-coursework-id/${coursework_id}/`);
    }

    getAllByUserId(user_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-user-id/${user_id}/`);
    }
    getAllByUserIdAndTermId(user_id, term_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-user-id/${user_id}/and-term-id/${term_id}/`);
    }

    getByUserIdAndCourseworkId(user_id, coursework_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-user-id/${user_id}/and-coursework-id/${coursework_id}/`);
    }

    getByStudentIdAndCourseworkId(student_id, coursework_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-student-id/${student_id}/and-coursework-id/${coursework_id}/`);
    }

    getAllByInstitution(institutionId) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-institution-id/${institutionId}/`);
    }

    getAllByInstitutionAndTermId(institutionId, term_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-institution-id/${institutionId}/and-term-id/${term_id}/`);
    }

    getAllByClassroomId(classroom_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-classroom-id/${classroom_id}/`);
    }

    getAllByClassroomIdAndTermId(classroom_id, term_id) {
        return instance.get(`/coursework/coursework-marks/get-all-coursework-marks-by-classroom-id/${classroom_id}/and-term-id/${term_id}/`);
    }


    update(id, data) {
        return instance.put(`/coursework/coursework-marks/${id}/`, data);
    }

    delete(id) {
        return instance.delete(`/coursework/coursework-marks/${id}/`);
    }
}

export default new CourseworkMarkService();