import instance, {formsRequestInstance} from "../http-common";

class InstitutionService {
    create(data) {
        return instance.postForm('institutions/', data)
    }

    get(id) {
        return instance.get(`institutions/${id}/`)
    }

    delete(tenantId) {
        return instance.delete(`institutions/${tenantId}/`)
    }

    getByTenantId(tenantId) {
        return instance.get(`/institutions/get-by-tenantId/${tenantId}/`)
    }

    getLogoByTenantId(tenantId) {
        return instance.get(`/institutions/get-institution-logo/${tenantId}/`)
    }

        getAll() {
        return instance.get('institutions/get-all-institutions/')
    }

    getByInstitutionOwnerId(id) {
        return instance.get(`institutions/get-all-by-institution-owner-id/${id}/`)
    }

    getTotalNumberOfInstitutions() {
        return instance.get('institutions/get-total-number-of-institutions/')
    }

    updateInstitutionLogo(id, data) {
        return formsRequestInstance.postForm(`institutions/update-institution-logo/${id}/`, data)
    }
}

export default new InstitutionService();