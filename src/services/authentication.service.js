import instance, {apiUrl} from "../http-common";
import {jwtDecode} from "jwt-decode";

class AuthenticationService {
    login(data) {
        return instance.post(`${apiUrl}accounts/token/`, data)
    }

    verifyPassword(data) {
        return instance.post('accounts/verify-password/', data)
    }

    changePassword(data) {
        return instance.post('accounts/change-password/', data)
    }

    verifyToken(data) {
        return instance.post('accounts/token/verify/', data);
    }

    refreshToken(data) {
        return instance.post('accounts/token/refresh/', data)
    }

    logout() {
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    decodeToken() {
        const token = JSON.parse(localStorage.getItem('user'))?.access;
        return token && jwtDecode(token);
    }

    getRefreshToken() {
        return JSON.parse(localStorage.getItem('user'))?.refresh;
    }

    getUserRole() {
        const token = this.decodeToken();
        return token?.role;
    }

    getUsername() {
        const token = this.decodeToken();
        return token?.username;
    }

    getUserId() {
        const token = this.decodeToken();
        return token?.user_id;
    }

    getFullName() {
        const token = this.decodeToken();
        return (token?.firstName + " " + token?.lastName).toUpperCase()
    }

    getUserTenantId() {
        const token = this.decodeToken();
        return token?.tenant;
    }

    getIsLibrarian() {
        const token = this.decodeToken();
        return token?.is_librarian || token?.role === "ADMIN";
    }
}

export default new AuthenticationService();