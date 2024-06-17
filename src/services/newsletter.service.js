import instance from "../http-common";
import {formsRequestInstance} from "../http-common"

class NewsletterService {
    getAll(id) {
        return instance.get(`/newsletters/get-all-newsletters-by-institution-id/${id}/`);
    }

    getAllByAudience(institutionId, audience) {
        return instance.get(`/newsletters/get-newsletters-by-institution-id-audience/institution/${institutionId}/?audience=${audience}`);
    }

    getById(id) {
        return instance.get(`/newsletters/get-newsletter-by-id/${id}/`);
    }

    create(data){
        return formsRequestInstance.postForm("/newsletters/", data)
    }

    update(id, data) {
        return formsRequestInstance.put(`/newsletters/update-newsletter-by-id/${id}/`, data)
    }

    updateImage(id, data) {
        return formsRequestInstance.put(`/newsletters/change-newsletter-image-by-id/${id}/`, data)
    }

    delete(id) {
        return instance.delete(`/newsletters/delete-newsletter-by-id/${id}/`)
    }
}

export default new NewsletterService();