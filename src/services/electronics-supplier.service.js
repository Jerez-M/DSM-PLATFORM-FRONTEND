import instance from "../http-common";

class ElectronicsSupplierService {
    getAllByInstitution() {
        return instance.get(`assets/electronics/electronic-supplier/`)
    }
    getById(id) {
        return instance.get(`assets/electronics/electronic-supplier/${id}/`)
    }

    create(data) {
        return instance.post('assets/electronics/electronic-supplier/', data)
    }

    update(id, data) {
        return instance.put(`assets/electronics/electronic-supplier/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`assets/electronics/electronic-supplier/${id}/`)
    }
}

export default new ElectronicsSupplierService();