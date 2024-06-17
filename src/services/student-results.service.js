import instance from "../http-common";

class StudentResultsService {
    getCurrentTermResults(studentUserId){
        return instance.get(`/student-end-term-exams-marks/get-current-term-results/${studentUserId}/`)
    }
    getPreviousResults(studentUserId){
        return instance.get(`/student-end-term-exams-marks/get-previous-end-term-results/${studentUserId}/`)
    }

}

export default new StudentResultsService();