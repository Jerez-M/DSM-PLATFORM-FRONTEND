import instance from "../http-common";

class SchoolService {
    getSchoolbytenantId(tenantId){
        return instance.get(`/institutions/get-by-tenantId/${tenantId}/`)
    }
}

export default new SchoolService();