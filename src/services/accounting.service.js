import instance from "../http-common";

class CourseworkService {
    create(data) {
        return instance.post(`/transactions/`, data);
    }

    getById(id) {
        return instance.get(`/transactions/${id}/`);
    }

    update(id, data) {
        return instance.put(`/transactions/update/${id}/`, data);
    }

    delete(id) {
        return instance.delete(`/transactions/${id}/`);
    }

    getAllByInstitutionIdAndAcademicYear(institution_id, academic_year_id) {
        return instance.get(`/transactions/get-all/institution/${institution_id}/academic-year/${academic_year_id}/`);
    }

    getAllByInstitutionIdAndTermId(institution_id, term_id) {
        return instance.get(`/transactions/get-all/institution/${institution_id}/term/${term_id}/`);
    }

    getIncomesByInstitutionIdAndAcademicYear(institution_id, academic_year_id) {
        return instance.get(`/transactions/revenue/institution/${institution_id}/academic-year/${academic_year_id}/`);
    }

    getIncomesByInstitutionIdAndTermId(institution_id, term_id) {
        return instance.get(`/transactions/revenue/institution/${institution_id}/term/${term_id}/`);
    }

    getExpensesByInstitutionIdAndAcademicYear(institution_id, academic_year_id) {
        return instance.get(`/transactions/expenses/institution/${institution_id}/academic-year/${academic_year_id}/`);
    }

    getExpensesByInstitutionIdAndTermId(institution_id, term_id) {
        return instance.get(`/transactions/expenses/institution/${institution_id}/term/${term_id}/`);
    }

    getIncomeStatementByInstitutionIdAndAcademicYear(institution_id, academic_year_id) {
        return instance.get(`/transactions/get-income-statement/institution/${institution_id}/academic-year/${academic_year_id}/`);
    }

    getIncomeStatementByInstitutionIdAndPeriod(institution_id, start_date, end_date) {
        return instance.get(`/transactions/income-statement/institution/${institution_id}?start_date=${start_date}&end_date=${end_date}`);
    }

    getIncomeStatementByInstitutionIdAndTermId(institution_id, term_id) {
        return instance.get(`/transactions/get-income-statement/institution/${institution_id}/term/${term_id}/`);
    }

    getTransactionStatsByInstitutionIdAndTermId(institution_id, term_id) {
        return instance.get(`/transactions/get-statistics/institution/${institution_id}/term/${term_id}/`);
    }

}

export default new CourseworkService();