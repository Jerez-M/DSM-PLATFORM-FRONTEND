import instance from "../http-common";
import AuthenticationService from "./authentication.service";


const tenantId = AuthenticationService.getUserTenantId();

class ClassroomService {

    getAll(id) {
        return instance.get(`/class-rooms/get-classrooms-by-institution-id/${id}/`);
    }
    getAllClassroomsByLevelId(levelId, tenantId) {
        return instance.get(`/class-rooms/get-all-classrooms-by-level-Id-and-tenant-id/${levelId}/${tenantId}/`);
    }

    getById(id) {
        return instance.get(`/class-rooms/${id}/`);
    }

    getTotalNumberOfClassroomsByInstitutionId(id) {
        return instance.get(`class-rooms/get-total-number-of-classrooms-by-institution-id/${id}/`)
    }

    getStudentsByClassroomId(id) {
        return instance.get(`class-rooms/get-students-by-classroom-id/${id}/${tenantId}`)
    }
    getStudentsByClass(classId, instituteId) {
        return instance.get(`class-rooms/get-students-by-classroom-id/${classId}/${instituteId}`)
    }
    getStudentsWithoutClassesByTenantId( tenantId) {
        return instance.get(`/students/get-students-without-class/${tenantId}/`)
    }
    getStudentsWithoutLevelsByTenantId( tenantId) {
        return instance.get(`/students/get-students-without-level/${tenantId}/`)
    }

    getClassByTeacher(teacherId) {
        return instance.get(`class-rooms/get-classroom-by-teacher-id/${teacherId}/`)
    }
    getClassByTeacherUserId(userId) {
        return instance.get(`/class-rooms/get-classrooms-by-class-teacher-user-id/${userId}/`)
    }

    getStudentsByTeacherUserIdAndClassroomId(teacherUserId, classroomId) {
        return instance.get(`/student-class/get-students-by-class-teacher-user-id-and-classroom-id/teacher/${teacherUserId}/classroom/${classroomId}/`)
    }

    create(data) {
        return instance.post("/class-rooms/", data)
    }

    addStudentsToClass(data) {
        return instance.post("/class-rooms/add-students/", data)
    }

    update(id, data) {
        return instance.put(`/class-rooms/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`/class-rooms/${id}`)
    }

    getClassroomsWithGenderStatisticsByInstitutionId(id) {
        return instance.get(`class-rooms/get-classrooms-with-gender-statistics-by-institution-id/${id}/`)
    }
}

export default new ClassroomService();