import {
  Button,
  Form,
  Modal,
  message,
  Select,
} from "antd";
import { useState } from "react";
import courseworkTypeService from "../../../../services/coursework-type.service";
import { refreshPage } from "../../../../common";


const EditCourseworkType = ({ open, close, record }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: record ? record?.name : "",
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

      const { name } = formData;
      const data = {
        name: name || record?.name,
      };

      const id = record?.id;
      console.log("form data: ", data, record?.is_active,);

      const response = await courseworkTypeService.update(id, data);

      if (response.status === 202) {
        message.success("Coursework type updated successfully");
        refreshPage()
      } else {
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error updating term:", error);
      message.error(error ? error?.response?.data?.error : "An error occured while updating, please check your network");
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  return (
    <>
      <Modal
        title="Update Coursework type"
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
          <Form.Item label="Coursework type">
            <Select
              size="large"
              defaultValue={record ? record?.name : "please select type"}
              onChange={(value) => handleFormChange("name", value)}
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
         
          <Button
            type="primary"
            size="large"
            className="mt-3"
            loading={loading}
            disabled={disabled}
            block
            onClick={handleFormSubmit}
          >
            Update Coursework type
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditCourseworkType;
