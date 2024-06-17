import { Button, Form, Input, Modal, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import subjectService from "../../../../services/subject.service";
import authenticationService from "../../../../services/authentication.service";
import departmentService from "../../../../services/department.service";
import {toInputUppercase} from "../../../../common";

const EditSubject = ({ open, close, record }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  const [formData, setFormData] = useState({
    name: record ? record?.name : "",
    department: record ? record?.department?.name : "",
  });

  const institution = authenticationService.getUserTenantId();

  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value !== "" ? value : record ? record[fieldName] : "",
    }));
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments(
        authenticationService.getUserTenantId()
      );

      if (response.status === 200) {
        const departmentsMapped = response.data?.map((department) => ({
          label: department?.name,
          value: department?.id,
        }));
        console.log("academicYearsMapped: ", departmentsMapped);
        setDepartmentsList(departmentsMapped);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occured during fetching departments:", error);
    }
  };

  const handleFormSubmit = async () => {
    const { name, department } = formData;

    const data = {
      institution,
      name: name || record.name,
      department: department || record.department?.id,
    };

    try {
      setLoading(true);
      setDisabled(true);

      const id = record?.id;

      const response = await subjectService.update(id, data);

      if (response.status === 200) {
        window.location.reload();
        console.log("Subject updated:", response.data);
        message.success("Subject updated Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error(
          "Failed to edit subject, please check your network and try again."
        );
      }
    } catch (error) {
      console.log("Error occurred:", error);
      message.error(
        "Failed to edit subject, please check your network and try again."
      );
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleClose = () => {
    setFormData({
      name: "",
      department: "",
    });
    close();
    window.location.reload()
  };

  return (
    <>
      <Modal
        title="Update subject"
        visible={open}
        onCancel={handleClose}
        okButtonProps={{
          className: "d-none",
        }}
        cancelButtonProps={{
          className: "d-none",
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Subject name">
            <Input
              defaultValue={record ? record?.name : "enter subject name"}
              size="large"
              onInput={toInputUppercase}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Department">
            <Select
              defaultValue={
                record ? record?.department?.name : "Select department"
              }
              multiple="true"
              size="large"
              onChange={(value) => handleFormChange("department", value)}
              options={departmentsList}
            />
          </Form.Item>

          <Button
            type="primary"
            size="large"
            loading={loading}
            disabled={disabled}
            block
            onClick={handleFormSubmit}
          >
            Update subject
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditSubject;
