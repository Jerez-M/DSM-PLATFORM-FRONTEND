import instance from "../http-common";

class EndTermExamService {
    getAllByInstitutionId(tenant_id) {
        return instance.get(`end-term-exams/get-end-term-exam-by-institution-id-and-term-id?tenant_id=${tenant_id}`)
    }

    getAllByInstitutionIdAndTermId(tenant_id, term_id) {
        return instance.get(`end-term-exams/get-end-term-exam-by-institution-id-and-term-id?tenant_id=${tenant_id}&term_id=${term_id}`)
    }

    create(data) {
        return instance.post('end-term-exams/', data)
    }

    getBySubjectIdAndLevelId(subjectId, levelId) {
        return instance.get(`end-term-exams/get-end-term-exam-by-subject-id-and-level-id/subjectId=${subjectId}/levelId=${levelId}/`)
    }

    publishEndTermExams(tenantId) {
        return instance.put(`end-term-exams/publish-end-term-exams/institution/${tenantId}/`)
    }

    unPublishEndTermExams(tenantId) {
        return instance.put(`end-term-exams/unpublish-end-term-exams/institution/${tenantId}/`)
    }
}

export default new EndTermExamService();