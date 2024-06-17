import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  message,
  Select,
  Checkbox,
} from "antd";
import { useState, useEffect } from "react";
import schoolTermServices from "../../../../services/schoolTerm.services";
import authenticationService from "../../../../services/authentication.service";
import academicYearService from "../../../../services/academic-year.service";

const EditTerm = ({ open, close, record }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [formData, setFormData] = useState({
    name: record ? record?.name : "",
    startDate: record ? record?.startDate : null,
    endDate: record ? record?.endDate : null,
    academicYear: record ? record?.academicYear : null,
    is_active: record ? record?.is_active : null,
  });

  const institution = authenticationService.getUserTenantId();

  const handleFormChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      setDisabled(true);

      const { name, startDate, endDate, academicYear, is_active } = formData;
      const data = {
        name: name || record?.name,
        startDate: startDate || startDate?.startDate,
        endDate: endDate || record?.endDate,
        academicYear: academicYear || record?.academicYear,
        institution,
        is_active: is_active || record?.is_active,
      };

      const id = record?.id;
      console.log("form data: ", data, record?.is_active, "year", record?.academicYear);

      const response = await schoolTermServices.update(id, data);

      if (response.status === 200) {
        message.success("Term updated successfully");
        window.location.reload();
      } else {
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error updating term:", error);
      message.error(error ? error?.response?.data?.error : "An error occured while updating, please check your network");
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await academicYearService.getAllAcademicYears(
        authenticationService.getUserTenantId()
      );

      if (response.status === 200) {
        const academicYearsMapped = response.data?.map((year) => ({
          label: year?.name,
          value: year?.id,
        }));
        console.log("academicYearsMapped: ", academicYearsMapped);
        setAcademicYears(academicYearsMapped);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred during fetching academic years:", error);
    }
  };

  return (
    <>
      <Modal
        title="Update term"
        visible={open}
        onCancel={close}
        okButtonProps={{
          className: "d-none",
        }}
        cancelButtonProps={{
          className: "d-none",
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Term name">
            <Select
              size="large"
              defaultValue={record ? record?.name : "please select term"}
              onChange={(value) => handleFormChange("name", value)}
              options={[
                { label: "TERM 1", value: "TERM 1" },
                { label: "TERM 2", value: "TERM 2" },
                { label: "TERM 3", value: "TERM 3" },
              ]}
            />
          </Form.Item>
          <Divider type="horizontal" />
          <Form.Item
            label="Start date"
            help="State the starting date for the term."
          >
            <DatePicker
              className="w-100"
              size="large"
              // defaultValue={record ? new Date(record?.startDate) : null}
              onChange={(date, dateString) => {
                handleFormChange("startDate", dateString);
              }}
            />
          </Form.Item>
          <Divider type="horizontal" />
          <Form.Item
            label="End date"
            help="State the ending date for the term."
          >
            <DatePicker
              className="w-100"
              size="large"
              onChange={(date, dateString) => {
                handleFormChange("endDate", dateString);
              }}
            />
          </Form.Item>
          <Divider type="horizontal" />
          <Form.Item
            label="Is Active"
            help="Mark if the term being created is the current or active term"
          >
            <Checkbox
              onChange={(e) => handleFormChange("is_active", e.target.checked)}
              defaultValue={
                record ? record?.is_active : true
              }
              checked={formData.is_active}
            >
              Active
            </Checkbox>
          </Form.Item>
          <Divider type="horizontal" />
          <Button
            type="primary"
            size="large"
            className="mt-3"
            loading={loading}
            disabled={disabled}
            block
            onClick={handleFormSubmit}
          >
            Update term
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditTerm;
