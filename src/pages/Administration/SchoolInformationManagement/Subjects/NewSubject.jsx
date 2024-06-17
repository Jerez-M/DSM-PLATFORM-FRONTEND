import { Button, Form, Input, Modal, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import subjectService from "../../../../services/subject.service";
import authenticationService from "../../../../services/authentication.service";
import departmentService from "../../../../services/department.service";
import {toInputUppercase} from "../../../../common";
import {PlusOutlined} from "@ant-design/icons";

const NewSubject = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [departmentsList, setDepartmentsList ] = useState([]);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    name: "",
    department: null,
  });

  const institution = authenticationService.getUserTenantId()

  const handleFormChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments(authenticationService.getUserTenantId())

      if (response.status === 200) {
        const departmentsMapped = response.data?.map((department) => ({
          label: department?.name,
          value: department?.id,
        }));
        setDepartmentsList(departmentsMapped);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred during fetching departments:", error);
    }
  };

  const handleFormSubmit = async () => {
    const { name, department } = formData;
    try {
      setLoading(true);
      setDisabled(true);

      const data = {
        institution,
        name,
        department,
      };

      const response = await subjectService.create(data);

      if (response.status === 201) {
        await window.location.reload()
        message.success("New subject Added Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.log("Error occurred:", error);
      message.error("An error occurred. Please check your network connection.");
    } finally {
      setLoading(false);
      setDisabled(false)
      close();
    }
  };
  useEffect(() => {
    fetchDepartments();
}, []);

  return (
    <>
      <Modal
        title="Add new subject"
        visible={open}
        onCancel={close}
        okButtonProps={{
          className: "d-none",
        }}
        cancelButtonProps={{
          className: "d-none",
        }}
      >
        <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
          <Form.Item
              label="Subject name"
              name="name"
              rules={[{ required: true, message: "Subject name is required!" }]}
          >
            <Input
              placeholder="Subject name"
              size="large"
              onInput={toInputUppercase}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: "Department is required!" }]}
          >
            <Select
              placeholder="Department"
              multiple = "true"
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
            htmlType="submit"
            icon={<PlusOutlined />}
          >
            Add new subject
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewSubject;
