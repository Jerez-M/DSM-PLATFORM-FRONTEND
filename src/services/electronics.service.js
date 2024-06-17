import instance from "../http-common";

class ElectronicsService {
    getAllByInstitution() {
        return instance.get(`assets/electronics/electronic-device/`)
    }

    getAllByCategory(categoryId) {
        return instance.get(`assets/electronics/electronic-device/get-by-category-id/${categoryId}/`)
    }

    getAllBySupplier(categoryId) {
        return instance.get(`assets/electronics/electronic-device/get-by-supplier-id/${categoryId}/`)
    }

    getById(id) {
        return instance.get(`assets/electronics/electronic-device/${id}/`)
    }

    getStatsByInstitutionId(institutionId) {
        return instance.get(`assets/electronics/electronic-device/get-stats-by-institution-id/${institutionId}/`)
    }

    create(data) {
        return instance.post('assets/electronics/electronic-device/', data)
    }

    update(id, data) {
        return instance.put(`assets/electronics/electronic-device/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`assets/electronics/electronic-device/${id}/`)
    }
}

export default new ElectronicsService();