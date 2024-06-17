import instance from "../http-common";

class AcademicYearService {
  getAllAcademicYears(id) {
    return instance.get(`/academic-years/get-academic-years-by-institution-id/${id}/`);
  }

  getAcademicYearById(AcademicYearid) {
    return instance.get(`/academic-years/${AcademicYearid}`);
  }
  create() {
    return instance.post("/academic-years/");
  }

  updateAcademicYear(AcademicYearid, data) {
    return instance.put(`/academic-years/update/${AcademicYearid}`, data);
  }

  deleteAcademicYear(yearid) {
    return instance.delete(`/academic-years/delete/${yearid}`);
  }
}

export default new AcademicYearService();
