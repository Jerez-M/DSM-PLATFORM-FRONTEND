import instance from "../http-common";

class VehicleInsuranceService {
    getAllByInstitution(institutionId) {
        return instance.get(`assets/vehicles/vehicle-insurance/get-all-by-institution-id/${institutionId}/`)
    }
    getById(id) {
        return instance.get(`assets/vehicles/vehicle-insurance/${id}/`)
    }

    getInsurancesByVehicleId(vehicleId) {
        return instance.get(`assets/vehicles/vehicle-insurance/get-all-by-vehicle-id/${vehicleId}/`)
    }

    create(data) {
        return instance.post('assets/vehicles/vehicle-insurance/', data)
    }

    update(id, data) {
        return instance.put(`assets/vehicles/vehicle-insurance/${id}/`, data)
    }

}

export default new VehicleInsuranceService();