import instance from "../http-common";

class LiveClassesService {
    create(data) {
        return instance.post('/video-conferencing/live-class/', data)
    }

    getByInstitution(id) {
        return instance.get(`/video-conferencing/live-class/get-by-tenant-id/${id}/`)
    }

    getByModerator(id) {
        return instance.get(`/video-conferencing/live-class/get-by-moderator-id/${id}/`)
    }

    getByStudent(id) {
        return instance.get(`/video-conferencing/live-class/get-by-student-user-id/${id}/`)
    }

    getToken(data) {
        return instance.post(`/video-conferencing/get-token/`, data)
    }
}

export default new LiveClassesService();