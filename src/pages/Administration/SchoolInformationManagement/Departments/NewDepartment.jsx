import { Button, Form, Modal, Select, message } from "antd";
import { useState } from "react";
import departmentService from "../../../../services/department.service";
import authenticationService from "../../../../services/authentication.service";
import {handleError} from "../../../../common";
import {PlusOutlined} from "@ant-design/icons";

const NewDepartment = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [departments, setDepartments] = useState();
  const [form] = Form.useForm();

  const institution = authenticationService.getUserTenantId()

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      setDisabled(true);

      const requestData = departments?.map(department => {
        return {
          name: department,
          institution
        }
      })

      console.log("Request Data:", requestData);

      const response = await departmentService.create(requestData);

      if (response.status === 200) {
        await window.location.reload()
        console.log("New department created:", response.data);
        close();
        setLoading(false);
        setDisabled(false);
        message.success("Department Added Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        setLoading(false);
        setDisabled(false);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      setLoading(false);
      setDisabled(false);
      message.error(error?.response?.data?.error || "An error occurred, please check your network.")
    }
  };

  // console.clear()
  return (
    <>
      <Modal
        title="Add new departments"
        open={open}
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
              label="Department name"
              name="name"
              rules={[{ required: true, message: "At least one department is required!" }]}
          >
            <Select
              placeholder="Department name"
              size="large"
              onChange={setDepartments}
              mode="multiple"
              options={[
                { label: "SCIENCES", value: "SCIENCES" },
                { label: "ARTS", value: "ARTS" },
                { label: "COMMERCIALS", value: "COMMERCIALS" },
                { label: "HUMANITIES", value: "HUMANITIES" },
                { label: "LANGUAGES", value: "LANGUAGES" },
                { label: "MATHEMATICS", value: "MATHEMATICS" },
                { label: "ARTS AND HUMANITITES", value: "ARTS_AND_HUMANITITES" },
                { label: "ARTS AND LANGUAGES", value: "ARTS_AND_LANGUAGES" },
                { label: "SCIENCES AND MATHEMATICS", value: "SCIENCES_AND_MATHEMATICS" },
              ]}
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
            Add new departments
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewDepartment;
