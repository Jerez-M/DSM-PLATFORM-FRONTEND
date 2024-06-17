import instance from "../http-common";

class DemoRequestsService {
    getAllRequests(){
        return instance.get(`/request-demo/get-all/`)
    }

    markAsAttended(requestId){
        return instance.put(`request-demo/update-status/${requestId}/`);
    }
}

export default new DemoRequestsService();