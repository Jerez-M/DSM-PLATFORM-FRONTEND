import { Button, DatePicker, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import authenticationService from "../../../services/authentication.service";
import { PlusOutlined } from "@ant-design/icons";
import suspensionService from "../../../services/suspension-service";
import TextArea from "antd/es/input/TextArea";
import {refreshPage} from "../../../common";

const SuspendStudent = ({ open, close, studentId, fullname}) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    suspension_date: "",
    return_date: "",
    institution: "",
  });

  const institution = authenticationService.getUserTenantId();

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

      const { reason, suspension_date, return_date } = formData;
      const student = studentId

      const data = {
        institution,
        student,
        reason,
        suspension_date,
        return_date,
      };

      console.log("studentId id : ", studentId)
      const response = await suspensionService.suspend(data, studentId);

      if (response.status === 201) {
        message.success("Student Suspended Successfully");
        refreshPage();
        close();
        setLoading(false);
        setDisabled(false);
      } else {
        setLoading(false);
        setDisabled(false);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.log("Error occurred:", error);
      setLoading(false);
      setDisabled(false);
      message.error("An error occurred. Please check your network connection.");
    }
  };

  console.clear()
  return (
    <>
      <Modal
        title="Suspend Student"
        visible={open}
        onCancel={close}
        width={800}
        okButtonProps={{
          className: "d-none",
        }}
        cancelButtonProps={{
          className: "d-none",
        }}
      >
        <Form layout="vertical">
          <div className="row">
            <Form.Item label="Student name">
              <Input
                size="large"
                value={fullname}
                style={{ backgroundColor: "grey" }}
              />
            </Form.Item>
            <Form.Item label="Reason for suspension">
              <TextArea
                placeholder="type reason for suspension here"
                size="large"
                style={{height: "150px" }}
                onChange={(e) =>
                  handleFormChange("reason", e.target.value)
                }
              />
            </Form.Item>
            <Form.Item label="Suspension date">
              <DatePicker
                placeholder="suspension date"
                size="large"
                onChange={(date, datestring) => handleFormChange("suspension_date", datestring)}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Return date">
              <DatePicker
                placeholder="return date"
                size="large"
                onChange={(date, datestring) => handleFormChange("return_date", datestring)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            size="large"
            loading={loading}
            icon={<PlusOutlined />}
            disabled={disabled}
            block
            onClick={handleFormSubmit}
          >
            Suspend Student
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default SuspendStudent;
