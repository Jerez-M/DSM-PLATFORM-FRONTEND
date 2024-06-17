import instance from "../http-common";

class InstitutionOwnerService {
    create(data) {
        return instance.post('institution-owners/', data)
    }

    get(id) {
        return instance.get(`institution-owners/${id}/`)
    }

    update(id) {
        return instance.put(`institution-owners/${id}/`)
    }

    delete(id) {
        return instance.delete(`institution-owners/${id}/`)
    }

    getAll() {
        return instance.get('institution-owners/get-all-institution-owners/')
    }
}

export default new InstitutionOwnerService();
