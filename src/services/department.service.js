import instance from "../http-common";

class DepartmentService {
    getAllDepartments(tenantId){
        return instance.get(`/departments/get-departments-by-institution-id/${tenantId}/`)
    }
    getDepartment(id){
        return instance.get(`/departments/${id}/`)
    }
     create(data){
        return instance.post("/departments/batch-create-departments/", data);
     }

     update(id, data){
        return instance.put(`/departments/${id}/`, data);
     }
}

export default new DepartmentService();