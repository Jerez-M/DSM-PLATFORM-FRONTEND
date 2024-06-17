import instance from "../http-common";

class AccountsService {

    getAllAccountsByInstitution(institutionId) {
        return instance.get(`accounts/get-all-users-except-parents-by-institution-id/${institutionId}/`)
    }
}

export default new AccountsService();