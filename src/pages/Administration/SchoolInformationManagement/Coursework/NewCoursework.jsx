import {Button, Form, Modal, message, AutoComplete} from "antd";
import { useState } from "react";
import CourseworkTypeService from "../../../../services/coursework-type.service";
import authenticationService from "../../../../services/authentication.service";
import {handleJerryError, refreshPage} from "../../../../common";
import {PlusOutlined} from "@ant-design/icons";
import {COURSEWORK_TYPES} from "../../../../utils/coursework-type";

const NewCourseworkType = ({ open, close, courseworkType }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const institution = authenticationService.getUserTenantId()

  const handleFormSubmit = async (values) => {
    try {
      setLoading(true);

      const requestData = {
        name: values.name,
        institution
      }

      if(courseworkType?.id) {
        const response = await CourseworkTypeService.update(courseworkType.id, requestData);

        if (response.status === 200) {
          message.success("CourseworkType Updated Successfully");
          refreshPage()
        }
      } else {
        const response = await CourseworkTypeService.create(requestData);

        if (response.status === 201) {
          message.success("CourseworkType Added Successfully");
          refreshPage()
        }
      }
    } catch (e) {
      setLoading(false);
      handleJerryError(e)
    }
  };

  return (
    <>
      <Modal
        title="Add new coursework type"
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
              label="Coursework Type"
              name="name"
              rules={[{ required: true, message: "Coursework type name is required!" }]}
              initialValue={courseworkType?.name}
          >
            <AutoComplete
              placeholder="Coursework Type name"
              size="large"
              filterOption={(inputValue, option) =>
                  option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              options={COURSEWORK_TYPES}
            />
          </Form.Item>
          <Button
            type="primary"
            size="large"
            loading={loading}
            block
            htmlType="submit"
            icon={<PlusOutlined />}
          >
            Add new courseworkType
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewCourseworkType;
