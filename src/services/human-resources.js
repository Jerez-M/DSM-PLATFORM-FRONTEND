import instance from "../http-common";

class HumanResourcesService {
    getEmployees() {
        return instance.get("human-resources/");
    }

    getEmployee(id) {
        return instance.get(`human-resources/ancillary/${id}/`);
    }

    getAllEmployeesByInstitutionId(id) {
        return instance.get(`human-resources/get-all-employees-by-institution-id/${id}/`);
    }

    createEmployee(data) {
        return instance.post("human-resources/", data);
    }

    updateEmployee(id, data) {
        return instance.put(`human-resources/ancillary/${id}/`, data);
    }

    deleteEmployee(id) {
        return instance.delete(`human-resources/ancillary/${id}/`);
    }

    createEducationalQualification(data) {
        return instance.post(`human-resources/ancillary-educational-experience/`, data);
    }

    deleteEducationalQualification(id) {
        return instance.delete(`human-resources/ancillary-educational-experience/${id}/`);
    }

    updateAncillaryStaffMemberProfilePicture(id, data) {
        return instance.putForm(`human-resources/update-ancillary-profile-picture-using-ancillary-id/${id}/`, data);
    }

    getEmployeeCountByInstitutionId(id) {
        return instance.get(`human-resources/get-total-number-of-employees-by-institution-id/${id}/`);
    }

    getSalaryBillByInstitutionId(id) {
        return instance.get(`human-resources/salary-adjustments/get-current-ancillary-staff-salary-bill-by-institution-id/${id}/`);
    }

    getPayrollRecordsByInstitutionIdAndAcademicYearId(tenantId, academicYearId) {
        return instance.get(`human-resources/payroll-records/get-payroll-records-by-institution-id-and-academic-year-id/?tenant_id=${tenantId}&year=${academicYearId}`)
    }

    processPayroll(data) {
        return instance.post('human-resources/process-payroll/', data)
    }

    getPayslipsByEmployeeId(id) {
        return instance.get(`human-resources/payslips/get-all-by-employee-id/?employee=${id}`)
    }

    getPayslipsByPayrollRecordIdAndInstitutionId(payroll, tenantId) {
        return instance.get(`human-resources/payslips/get-all-by-payroll-record-id-and-institution-id/?payroll=${payroll}&tenant_id=${tenantId}`)
    }

    createCompensationElement(data) {
        return instance.post('human-resources/compensation-elements/', data)
    }

    createPayslip(data) {
        return instance.post('human-resources/payslips/', data)
    }

    getActiveYearPayrollRecordsByInstitutionId(tenantId) {
        return instance.get(`human-resources/payroll-records/get-all-active-year-payroll-records-by-institution-id/?tenant_id=${tenantId}`)
    }

    getCompensationElementsByInstitutionIdAndType(tenantId, type) {
        return instance.get(`human-resources/compensation-elements/get-all-by-institution-id-and-type/?tenant_id=${tenantId}&type=${type}`)
    }

    createSalaryAdjustment(data) {
        return instance.post('human-resources/salary-adjustments/', data)
    }

    getCompensationElementsByInstitutionId(tenantId) {
        return instance.get(`human-resources/compansation-elements/get-all-by-institution-id/?tenant_id=${tenantId}`)
    }

    getSalaryAdjustmentsByEmployeeId(id) {
        return instance.get(`human-resources/salary-adjustments/get-all-by-employee-id/?employee=${id}`)
    }

    deleteSalaryAdjustment(id) {
        return instance.delete(`human-resources/salary-adjustments/${id}/`)
    }

    updateSalaryAdjustment(id, data) {
        return instance.put(`human-resources/salary-adjustments/${id}/`, data)
    }

    deleteCompensationElement(id) {
        return instance.delete(`human-resources/compensation-elements/${id}/`)
    }

    updateCompensationElement(id, data) {
        return instance.put(`human-resources/compensation-elements/${id}/`, data)
    }
}

export default new HumanResourcesService();
