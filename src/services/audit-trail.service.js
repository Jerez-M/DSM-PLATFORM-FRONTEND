import instance from "../http-common";

class AuditTrailService {
    getAuditTrailsByInstitutionId(id) {
        return instance.get(`/audit-trail/get-all-by-institution-id/${id}/`);
    }
}

export default new AuditTrailService();