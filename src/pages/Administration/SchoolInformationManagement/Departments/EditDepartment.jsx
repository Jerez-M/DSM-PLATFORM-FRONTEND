import { Button, Form, Input, Modal, Select, message } from "antd";
import { useState } from "react";
import departmentService from "../../../../services/department.service";
import authenticationService from "../../../../services/authentication.service";

const EditDepartment = ({ open, close, record }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: ""
  });

  const institution = authenticationService.getUserTenantId()
  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      setDisabled(true);

      const {
        name,
      } = formData;

      const requestData = {
        name,
        institution
      };
      const id = record?.id
      console.log("Request Data:", requestData, "id is: ", id);

      const response = await departmentService.update(id, requestData);

      if (response.status === 200) {
        await window.location.reload()
        console.log("Department updated successifully:", response.data);
        close();
        setLoading(false);
        setDisabled(false);
        message.success("Department updated successifully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        setLoading(false);
        setDisabled(false);
        message.error("Failed to update department, please try again later.");
      }
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      message.error(error?.response?.data?.error || "Failed to update department, please check your network and try again.")
    }
  };

  // console.clear()
  return (
    <>
      <Modal
        title="Update new department"
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
          <Form.Item label="Department name">
            <Select
              size="large"
              onChange={(value) => handleFormChange("name", value)}
              defaultValue={record ? record?.name : "Select department"}
              options={[
                { label: "SCIENCES", value: "SCIENCES" },
                { label: "ARTS", value: "ARTS" },
                { label: "COMMERCIALS", value: "COMMERCIALS" },
                { label: "HUMANITIES", value: "HUMANITIES" },
                { label: "LANGUAGES", value: "LANGUAGES" },
                { label: "MATHEMATICS", value: "MATHEMATICS" },
                { label: "ARTS AND HUMANITITES", value: "ARTS AND HUMANITITES" },
                { label: "ARTS AND LANGUAGES", value: "ARTS AND LANGUAGES" },
                { label: "SCIENCES AND MATHEMATICS", value: "SCIENCES AND MATHEMATICS" },
              ]}
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
            Update department
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditDepartment;
