import { Button, Form, Input, Modal, message } from "antd";
import { useState } from "react";
import authenticationService from "../../../services/authentication.service";
import { PlusOutlined } from "@ant-design/icons";
import suspensionService from "../../../services/suspension-service";
import TextArea from "antd/es/input/TextArea";
import {refreshPage} from "../../../common";

const ExpelStudent = ({ open, close, studentId, fullname}) => {
  // const { studentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
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

      const { reason } = formData;
      const student = studentId

      const data = {
        institution,
        student,
        reason,
      };

      console.log("studentId id : ", studentId)
      const response = await suspensionService.expel(data, studentId);

      if (response.status === 201) {
        close();
        setLoading(false);
        setDisabled(false);
        message.success("Student Expelled Successifully");
        refreshPage();
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

  // console.clear()
  return (
    <>
      <Modal
        title="Expel Student"
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
            <Form.Item label="Reason for expulsion">
              <TextArea
                placeholder="type reason for expulsion here"
                size="large"
                style={{height: "150px" }}
                onChange={(e) =>
                  handleFormChange("reason", e.target.value)
                }
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
            Expel Student
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ExpelStudent;
