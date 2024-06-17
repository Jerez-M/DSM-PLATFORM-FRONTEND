import { Button, Divider, Form, Modal, message, Select } from "antd";
import { useState, useEffect } from "react";
import authenticationService from "../../../../services/authentication.service";
import TextArea from "antd/es/input/TextArea";
import SMSservice from "../../../../services/SMSservice";
import parentService from "../../../../services/parent.service";

const NewParentsSms = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    message: "",
    dispatch: "Client",
    userType: "PARENT",
    toUserId: null,
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

      const { message, dispatch, toUserId, userType } = formData;
      const data = {
        message,
        dispatch,
        userType,
        toUserId,
      };
      console.log("form data: ", data);

      const response = await SMSservice.sendBulkySms(data);

      if (response.status === 201) {
        console.log("SMSs send successifully.", response.data);
        message.success("SMSs send successifully.");
        // await window.location.reload();

      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error sending SMSs:", error);
      message.error("An error occured, please check your network and try again.")
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
      const response = await parentService.getParentByInstitutionId(
        authenticationService.getUserTenantId()
      );

      if (response.status === 200) {
        const parentsMapped = response.data?.map((parent) => ({
          label: parent?.students[0]?.user?.firstName + ' ' + parent?.students[0]?.user?.lastName + ' ' + parent?.students[0]?.user?.username,
          value: parent?.id,
        }));
        console.log("parentsMapped: ", parentsMapped);
        setParents(parentsMapped);
      } else {
        console.log("Request was not successful. Status:", response.status);
      }
    } catch (error) {
      console.error("Error occured during fetching academic years:", error);
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
            <TextArea style={{ height: "200px" }} placeholder="type message to send to parents" onChange={(e)=>handleFormChange("message", e.target.value)}/>
          </Form.Item>
          <Divider type="horizontal" />
         
          <Form.Item
            label="Parents"
            help="Select student/students whose parents you want to send SMS to."
          >
            <Select
              placeholder="Select parents"
              size="large"
              mode="multiple"
              onChange={(value) => handleFormChange("toUserId", value)}
              options={parents}
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

export default NewParentsSms;