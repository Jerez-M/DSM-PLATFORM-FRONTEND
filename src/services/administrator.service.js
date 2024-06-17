import instance from "../http-common";

class AdministratorService {
    getAllAdministrators() {
        return instance.get('administrators/get-all-administrators/')
    }

    getAllAdministratorsByInstitution(institutionId) {
        return instance.get(`administrators/get-all-administrators-by-institution-id/${institutionId}/`)
    }

    getAllNonStudentAccountsByInstitution(institutionId) {
        return instance.get(`accounts/get-all-users-except-students-and-parents-by-institution-id/${institutionId}/`)
    }

    create(data) {
        return instance.post('administrators/', data)
    }
}

export default new AdministratorService();