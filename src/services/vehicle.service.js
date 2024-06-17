import instance from "../http-common";

class VehicleService {
    getAllByInstitution(institutionId) {
        return instance.get(`assets/vehicles/get-all-by-institution-id/${institutionId}/`)
    }

    getById(id) {
        return instance.get(`assets/vehicles/${id}/`)
    }
    getVehicleById(id) {
        return instance.get(`assets/vehicles/get/${id}/`)
    }

    getVehicleStatsByInstitutionId(institutionId) {
        return instance.get(`assets/vehicles/get-all-vehicle-stats-by-institution-id/${institutionId}/`)
    }

    create(data) {
        return instance.post('assets/vehicles/', data)
    }

    update(id, data) {
        return instance.put(`assets/vehicles/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`assets/vehicles/${id}/`)
    }
}

export default new VehicleService();