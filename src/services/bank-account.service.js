import instance from "../http-common";

class BankAccountService {
    getSchoolBankingDetails(tenantId){
        return instance.get(`/banking-details/get-banking-details-by-institution-id/${tenantId}/`)
    }

    getBankingDetailById(id){
        return instance.get(`/banking-details/${id}/`)
    }

    create(data){
        return instance.post("/banking-details/", data);
    }

    update(bankDetailId, data){
        return instance.put(`/banking-details/${bankDetailId}`, data);
    }
}

export default new BankAccountService();