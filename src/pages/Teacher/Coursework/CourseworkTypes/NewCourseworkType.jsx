import { Button, Divider, Form, Modal, message, AutoComplete } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import authenticationService from "../../../../services/authentication.service";
import courseworkTypeService from "../../../../services/coursework-type.service";
import { refreshPage } from "../../../../common";

const NewCourseworkType = ({ open, close }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: ""
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

      const { name } = formData;
      const data = {
        name,
        institution,
      };
      console.log("form data: ", data);

      const response = await courseworkTypeService.create(data);

      if (response.status === 201) {
        refreshPage()
        message.success("New coursework type Added Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error creating New coursework type:", error);
      message.error(error ? error?.response?.data?.error : "An error occured, please check your network");
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  return (
    <>
      <Modal
        title="Add new coursework type"
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
            label="Coursework type name"
            name="name"
            rules={[{ required: true, message: "coursework type name is required!" }]}
          >
            <AutoComplete
              size="large"
              placeholder="Select or type coursework type name"
              onChange={(value) => handleFormChange("name", value)}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              showSearch
              options={[
                { label: "ASSIGNMENT", value: "ASSIGNMENT" },
                { label: "HOMEWORK", value: "HOMEWORK" },
                { label: "PRESENTATION", value: "PRESENTATION" },
                { label: "INCLASS TEST", value: "INCLASS TEST" },
                { label: "EXAM", value: "EXAM" },
                { label: "CALA", value: "CALA" },
                { label: "GROUP WORK", value: "GROUP WORK" },
                { label: "PROJECT", value: "PROJECT" },
                { label: "QUIZ", value: "QUIZ" },
                { label: "LAB WORK", value: "LAB WORK" },  
              ]}
            />
          </Form.Item>
          <Divider type="horizontal" />

          <Button
            type="primary"
            size="large"
            className="mt-3"
            loading={loading}
            disabled={disabled}
            icon={<PlusOutlined />}
            block
            htmlType="submit"
          >
            Add New coursework type
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewCourseworkType;