import instance from "../http-common";

class VehicleServiceService {
    getAllByInstitution(institutionId) {
        return instance.get(`assets/vehicles/vehicle-services/get-all-by-institution-id/${institutionId}/`)
    }
    getById(id) {
        return instance.get(`assets/vehicles/vehicle-services/${id}/`)
    }

    getServicesByVehicleId(vehicleId) {
        return instance.get(`assets/vehicles/vehicle-services/get-all-by-vehicle-id/${vehicleId}/`)
    }

    create(data) {
        return instance.post('assets/vehicles/vehicle-services/', data)
    }

    update(id, data) {
        return instance.put(`assets/vehicles/vehicle-services/${id}/`, data)
    }

}

export default new VehicleServiceService();