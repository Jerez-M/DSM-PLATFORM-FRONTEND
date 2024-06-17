import instance from "../http-common";

class CourseworkTypeService {
    getAll(tenantId){
        return instance.get(`/coursework/coursework-types/get-all-coursework-types-by-institution-id/${tenantId}/`)
    }
    getCourseworkType(id){
        return instance.get(`/coursework/coursework-types/${id}/`)
    }
     create(data){
        return instance.post("/coursework/coursework-types/", data);
     }

     update(id, data){
        return instance.put(`/coursework/coursework-types/${id}/`, data);
     }

     delete(id, data){
        return instance.delete(`/coursework/coursework-types/${id}/`, data);
     }
}

export default new CourseworkTypeService();