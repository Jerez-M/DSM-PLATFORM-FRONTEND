import instance from "../http-common";

class LibraryService {
    getAllByInstitution(institutionId) {
        return instance.get(`libraries/get-all-by-institution-id/${institutionId}/`)
    }

    getById(id) {
        return instance.get(`libraries/${id}/`)
    }

    async getTotalLibraryStatsByInstitutionId(tenantId) {
        return instance.get(`libraries/get-all-institution-library-stats-by-institution-id/${tenantId}/`)
    }

    create(data) {
        return instance.post('libraries/', data)
    }

    update(id, data) {
        return instance.put(`libraries/update-library-librarians/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`libraries/${id}/`)
    }
}

export default new LibraryService();