import { Button, Divider, Form, Modal, message, Select } from "antd";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import SMSservice from "../../../../services/SMSservice";

const NewBulkySms = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    dispatch: "Client",
    userType: ""
  });


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

      const { message, dispatch, userType } = formData;
      const data = {
        message,
        dispatch,
        userType,
      };
      console.log("form data: ", data);

      const response = await SMSservice.SendBulkySmsByUserRole(data);

      if (response.status === 201) {
        console.log("SMSs send successifully.", response.data);
        message.success("SMSs send successifully.");
        await window.location.reload();
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error sending SMSs:", error);
      message.error("An error occured, please check your network and try again.")
      // message.error(error ? error?.response?.data?.error : "An error occured, please check your network");
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  return (
    <>
      <Modal
        title="SEND NEW SMS"
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
          <Form.Item label="Message">
            <TextArea style={{ height: "200px" }} placeholder="type message to send to teachers" onChange={(e)=>handleFormChange("message", e.target.value)}/>
          </Form.Item>
          <Divider type="horizontal" />
         
          <Form.Item
            label="Audience group"
            help="Select the audience group to send sms to"
          >
            <Select
              placeholder="Select audience"
              size="large"
              onChange={(value) => handleFormChange("userType", value)}
              options={[
                {label: "ALL TEACHERS", value: "TEACHER"},
                {label: "ALL STUDENTS", value: "STUDENT"},
                {label: "ALL PARENTS", value: "PARENT"}
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
            block
            onClick={handleFormSubmit}
          >
            Send SMS
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewBulkySms;