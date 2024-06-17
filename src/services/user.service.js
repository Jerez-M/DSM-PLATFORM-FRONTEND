import instance from "../http-common";

class UserService {
    create(data) {
        return instance.post('accounts/', data)
    }
}

export default new UserService();