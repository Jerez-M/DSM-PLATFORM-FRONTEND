import instance from "../http-common";

class StudentMarkService {
    bulkUploadMarksForParticularPaper(paper, data) {
        return instance.post(`student-end-term-exams-marks/bulk-upload-student-marks-for-particular-paper/${paper}/`, data)
    }

    getCurrentTermResults(id) {
        return instance.get(`student-end-term-exams-marks/get-current-term-results-by-student-id/${id}/`)
    }

    getCurrentTermResultBySubjectIdAndStudentId(subjectId, studentId) {
        return instance.get(`student-end-term-exams-marks/get-current-term-results-by-student-id-and-subject-id/studentId=${studentId}/subjectId=${subjectId}/`)
    }

    examAnalysis(tenant_id) {
        return instance.get(`student-end-term-exams-marks/all-exam-analysis-for-each-exam?tenant_id=${tenant_id}`)
    }

    examAnalysisByTermId(tenant_id, term_id) {
        return instance.get(`student-end-term-exams-marks/all-exam-analysis-for-each-exam?tenant_id=${tenant_id}&term_id=${term_id}`)
    }
}

export default new StudentMarkService();