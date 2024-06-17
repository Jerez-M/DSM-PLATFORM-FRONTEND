import instance from "../http-common";

class LevelService {
    getAll(id) {
        return instance.get(`/levels/get-levels-by-institution-id/${id}/`);
    }

    getById(id) {
        return instance.get(`/levels/${id}/`);
    }

    create(data){
        return instance.post("/levels/create-bulk-levels/", data)
    }

    update(id, data) {
        return instance.put(`/levels/${id}/`, data)
    }

}

export default new LevelService();