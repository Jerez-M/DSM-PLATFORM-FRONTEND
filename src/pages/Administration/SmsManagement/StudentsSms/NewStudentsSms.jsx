import { Button, Divider, Form, Modal, message, Select } from "antd";
import { useState, useEffect } from "react";
import authenticationService from "../../../../services/authentication.service";
import studentService from "../../../../services/student.service";
import TextArea from "antd/es/input/TextArea";
import SMSservice from "../../../../services/SMSservice";

const NewStudentsSms = ({ open, close }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    message: "",
    dispatch: "Client",
    userType: "STUDENT",
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
      const response = await studentService.getAllStudentsByInstitutionId(
        authenticationService.getUserTenantId()
      );

      if (response.status === 200) {
        const studentsMapped = response.data?.map((student) => ({
          label: student?.user?.firstName + ' ' + student?.user?.lastName + ' ' + student?.user?.username,
          value: student?.id,
        }));
        console.log("studentsMapped: ", studentsMapped);
        setStudents(studentsMapped);
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
            <TextArea style={{ height: "200px" }} placeholder="type message to send to students" onChange={(e)=>handleFormChange("message", e.target.value)}/>
          </Form.Item>
          <Divider type="horizontal" />
         
          <Form.Item
            label="Students"
            help="Select the student/students to send sms to"
          >
            <Select
              placeholder="Select student"
              size="large"
              mode="multiple"
              onChange={(value) => handleFormChange("toUserId", value)}
              options={students}
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

export default NewStudentsSms;