import http from "../http-common";

class GeneralAssetsService {
    createAssetCategory(data) {
        return http.post(`assets/general-assets/general-assets-category/`, data);
    }
    // getAllAssetCategories(id) {
    //     return http.get(
    //         `assets/general-assets/general-assets-category/${id}/`
    //     );
    // }

    getAllAssetCategories(id) {
        return http.get(
            `assets/general-assets/general-assets-category/get-all-by-institution-id/${id}/`
        );
    }

    getAssetCategory(id) {
        return http.get(`/assets/general-assets/general-assets-category/${id}/`);
    }

    updateAssetCategory(id, data) {
        return http.put(`/assets/general-assets/general-assets-category/${id}/`, data);
    }

    deleteAssetCategory(id) {
        return http.delete(`/assets/general-assets/general-assets-category/${id}/`);
    }

    
    //general asset items

    createAssetItem(data) {
        return http.post('/assets/general-assets/general-assets-items/', data);
    }

    getAllAssetItems(categoryId) {
        return http.get(
            `/assets/general-assets/general-assets-items-by-category/${categoryId}/`
        );
    }

    getAssetItem(id) {
        return http.get(`/assets/general-assets/general-assets-items/${id}/`);
    }

    updateAssetItem(id, data) {
        return http.put(`/assets/general-assets/general-assets-items/${id}/`, data);
    }

    deleteAssetItem(id) {
        return http.delete(`/assets/general-assets/general-assets-items/${id}/`);
    }
}

export default new GeneralAssetsService();
