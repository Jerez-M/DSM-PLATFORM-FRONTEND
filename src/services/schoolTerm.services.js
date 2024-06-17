import http from "../http-common";

class SchoolTermDataService {
    getAll(schoolId, academicYearId) {
        return http.get(
            `/term/all?schoolId=${schoolId}&academicYearId=${academicYearId}`
        );
    }

    getClassname() {
        return http.get("/term/class-name");
    }

    get(id) {
        return http.get(`/term/term/${id}`);
    }

    create(data) {
        return http.post(`/terms/`, data);
    }

    update(id, data) {
        return http.put(`/terms/${id}/`, data);
    }

    delete(id) {
        return http.delete(`/terms/${id}`);
    }

    findByClass(className) {
        return http.get(`/term/?className=${className}`);
    }

    deleteAll() {
        return http.delete(`/term`);
    }

    findByTitle(title) {
        return http.get(`/terms/?title=${title}`);
    }

    getAllTermsByInstitution(tenantId) {
        return http.get(`/terms/get-terms-by-institution-id/${tenantId}/`);
    }

    getCurrentTerm(schoolId) {
        return http.get(`/term/get-current-term?schoolId=${schoolId}`);
    }

    getTermsInActiveAcademicYearByInstitutionId(tenantId) {
        return http.get(`/terms/get-terms-in-active-academic-year-by-institution-id/?institution=${tenantId}`);
    }
}

export default new SchoolTermDataService();
