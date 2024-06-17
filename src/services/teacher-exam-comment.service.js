import instance from "../http-common";

class TeacherExamCommentService {
    create(data) {
        return instance.post('teacher-end-term-exam-comments/', data)
    }

    get(endTermExamId, studentId) {
        return instance.get(`teacher-end-term-exam-comments/get-teacher-exam-comment-by-student-id-end-term-exam-id/endTermExamId/${endTermExamId}/studentId/${studentId}/`)
    }
}

export default new TeacherExamCommentService()