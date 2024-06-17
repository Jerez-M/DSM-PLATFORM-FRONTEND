import { Button, DatePicker, Divider, Form, Input, Modal, message, Select, Checkbox } from "antd";
import { useState, useEffect } from "react";
import schoolTermServices from "../../../../services/schoolTerm.services";
import authenticationService from "../../../../services/authentication.service";
import academicYearService from "../../../../services/academic-year.service";
import {PlusOutlined} from "@ant-design/icons";

const NewTerm = ({ open, close }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: null,
    endDate: null,
    academicYear: null,
    is_active: false,
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

      const { name, startDate, endDate, academicYear, is_active } = formData;
      const data = {
        name,
        startDate,
        endDate,
        academicYear,
        institution,
        is_active,
      };

      const response = await schoolTermServices.create(data);

      if (response.status === 201) {
        await window.location.reload();
        message.success("New Term Added Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error creating new term:", error);
      message.error(error ? error?.response?.data?.error : "An error occured, please check your network");
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
      const response = await academicYearService.getAllAcademicYears(
        authenticationService.getUserTenantId()
      );

      if (response.status === 200) {
        const academicYearsMapped = response.data?.map((year) => ({
          label: year?.name,
          value: year?.id,
        }));
        setAcademicYears(academicYearsMapped);
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
        title="Add new term"
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
              label="Term name"
              name="name"
              rules={[{ required: true, message: "Term name is required!" }]}
          >
            <Select
              size="large"
              placeholder="Select term"
              onChange={(value) => handleFormChange("name", value)}
              options={[
                { label: "TERM 1", value: "TERM 1" },
                { label: "TERM 2", value: "TERM 2" },
                { label: "TERM 3", value: "TERM 3" },
              ]}
            />
          </Form.Item>
          <Divider type="horizontal" />
          <Form.Item
            label="Term duration"
            help="State the starting and ending dates for the term."
            name="termDuration"
            rules={[{ required: true, message: "Term duration is required!" }]}
          >
            <DatePicker.RangePicker
              className="w-100"
              size="large"
              onChange={(dates, dateStrings) => {
                handleFormChange("startDate", dateStrings[0]);
                handleFormChange("endDate", dateStrings[1]);
              }}
            />
          </Form.Item>
          <Divider type="horizontal" />
          <Form.Item
            label="Academic year"
            help="Select your institution's academic year."
            name="academicYear"
            rules={[{ required: true, message: "Academic year is required!" }]}
          >
            <Select
              placeholder="Academic year"
              size="large"
              onChange={(value) => handleFormChange("academicYear", value)}
              options={academicYears}
            />
          </Form.Item>
          <Divider type="horizontal" />
          <Form.Item label="Is Active" help="Mark if the term being created is the current or active term">
            <Checkbox
              onChange={(e) => handleFormChange("is_active", e.target.checked)}
              checked={formData.is_active}
            >
              Active
            </Checkbox>
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
            Add new term
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewTerm;