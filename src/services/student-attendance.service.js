import instance from "../http-common";

class StudentAttendanceService {
    create(data) {
        return instance.post(`student-attendances/student-attendance-registers/`, data);
    }

    getStudentAttendanceByClassroomId(classroomId) {
        return instance.get(`student-attendances/student-attendance-registers/get-by-classroom-id/${classroomId}/`);
    }

    bulkCreateStudentAttendanceRecords(data) {
        return instance.post(`student-attendances/student-attendance-records/mark-bulk/`, data);
    }

    getStudentAttendanceRecordsByClassroomIdAndDate(classroomId, date) {
        return instance.get(`student-attendances/student-attendance-records/get-by-classroom-id-and-date/classroom/${classroomId}/date/${date}/`);
    }

    checkIfClassroomHasActiveAttendanceRegister(classroomId) {
        return instance.get(`/student-attendances/student-attendance-registers/check-if-classroom-has-active-register-by-classroom-id/${classroomId}/`)
    }

    getDailyAttendanceReportByInstitutionIdAndDate(institutionId, date) {
        return instance.get(`/student-attendances/student-attendance-records/get-institution-attendance-stats-by-institution-id-and-date/${institutionId}/date/${date}/`)
    }

    getDailyAttendanceReportByClassroomIdAndDate(classroomId, date) {
        return instance.get(`/student-attendances/student-attendance-records/get-classroom-stats-by-classroom-id-and-date/classroom/${classroomId}/date/${date}/`)
    }
}

export default new StudentAttendanceService();