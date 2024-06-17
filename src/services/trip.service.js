import instance from "../http-common";

class TripService {
    getAllByInstitution(institutionId) {
        return instance.get(`assets/vehicles/vehicle-trips/get-all-by-institution-id/${institutionId}/`)
    }

    getById(id) {
        return instance.get(`assets/vehicles/vehicle-trips/${id}/`)
    }

    getTripsByVehicleId(id) {
        return instance.get(`assets/vehicles/vehicle-trips/get-all-by-vehicle-id/${id}/`)
    }

    create(data) {
        return instance.post('assets/vehicles/vehicle-trips/', data)
    }

    update(id, data) {
        return instance.put(`assets/vehicles/vehicle-trips/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`assets/vehicles/vehicle-trips/${id}/`)
    }
}

export default new TripService();