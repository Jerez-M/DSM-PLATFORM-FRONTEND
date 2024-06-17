import instance from "../http-common";

class ElectronicsCategoryService {
    getAllByInstitution() {
        return instance.get(`assets/electronics/electronic-types/`)
    }
    getById(id) {
        return instance.get(`assets/electronics/electronic-types/${id}/`)
    }

    create(data) {
        return instance.post('assets/electronics/electronic-types/', data)
    }

    update(id, data) {
        return instance.put(`assets/electronics/electronic-types/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`assets/electronics/electronic-types/${id}/`)
    }
}

export default new ElectronicsCategoryService();