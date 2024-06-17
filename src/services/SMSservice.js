import instance from "../http-common";

class SMSservice {
    getAll(tenantId) {
        return instance.get(`/sms_notify/get-sms-by-tenant-id/${tenantId}/`);
    }
    getById(id) {
        return instance.get(`/get-sms-by-id/${id}/`);
    }
    getByUserType(userType) {
        return instance.get(`/sms_notify/get-sms-by-user-type/${userType}/`);
    }
    
    sendSingleSms(data){
        return instance.post("/sms_notify/send-one-sms/", data)
    }
    sendBulkySms(data){
        return instance.post("/sms_notify/send-bulk-sms/", data)
    }
    SendBulkySmsByUserRole(data){
        return instance.post("/sms_notify/send-bulk-sms-by-user-type/", data)
    }

    update(id, data) {
        return instance.put(`/update-sms/${id}/`, data)
    }

}

export default new SMSservice();