import instance from "../http-common";

class VehicleDamageService {
    getAllByInstitution(institutionId) {
        return instance.get(`assets/vehicles/vehicle-damages/get-all-by-institution-id/${institutionId}/`)
    }
    getById(id) {
        return instance.get(`assets/vehicles/vehicle-damages/${id}/`)
    }

    getDamagesByVehicleId(vehicleId) {
        return instance.get(`assets/vehicles/vehicle-damages/get-all-by-vehicle-id/${vehicleId}/`)
    }

    create(data) {
        return instance.post('assets/vehicles/vehicle-damages/', data)
    }

    update(id, data) {
        return instance.put(`assets/vehicles/vehicle-damages/${id}/`, data)
    }
}

export default new VehicleDamageService();