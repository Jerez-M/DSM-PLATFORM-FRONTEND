import { Button, DatePicker, Divider, Form, Input, Modal, message, Select, } from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import authenticationService from "../../../../../services/authentication.service";
import { useParams } from "react-router-dom";
import generalAssetsServices from "../../../../../services/general-assets.services";
import TextArea from "antd/es/input/TextArea";
import { currencyPrefix, refreshPage } from "../../../../../common";

const NewAssetItem = ({ open, close }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [assetCategoryList, setAssetCategoryList] = useState([]);
  
  const { id } = useParams()

  const [formData, setFormData] = useState({
    purchase_date: null,
    price: "",
    status: "",
    description: "",
    serial_number: "",
  });

  const tenant = authenticationService.getUserTenantId()

  const handleFormChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };
  const category = id

  const handleFormSubmit = async () => {
    try {
      setLoading(true);
      setDisabled(true);

      const { purchase_date, price, status, description, serial_number } = formData;
      const data = {
        category,
        purchase_date,
        price,
        status,
        description,
        serial_number,
        tenant
      };
      console.log("form data: ", data);

      const response = await generalAssetsServices.createAssetItem(data);

      if (response.status === 201) {
        refreshPage()
        message.success("New Asset Item Added Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error creating new asset item:", error);
      message.error(error ? error?.response?.data?.error : "An error occured, please check your network");
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  const fetchAssetCategorys = async () => {
      try {
          const response = await generalAssetsServices.getAssetCategory(id);

          if (response.status === 200) {
              setAssetCategoryList(response.data);
          } else {
              console.log("Request was not successful. Status:", response.status);
          }
      } catch (error) {
          console.error("Error occured during fetching academic years:", error);
      }
  };

  useEffect(() => {
      fetchAssetCategorys();
  }, []);


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
            label="Asset Category"
            name="category"
            // rules={[{ required: true, message: "category is required!" }]}
          >
            <Select
              size="large"
              onChange={(value) => handleFormChange("status", value)}
              defaultValue={assetCategoryList ? assetCategoryList?.name : "Select asset category"}
              options={[
                { label: assetCategoryList?.name, value: assetCategoryList?.id },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Purchase date"
            name="purchase_date"
          >
            <DatePicker
              className="w-100"
              size="large"
              onChange={(date, dateString) => {
                handleFormChange("purchase_date", dateString);
              }}
            />
          </Form.Item>
          <Form.Item
            label="status"
            name="status"
            rules={[{ required: true, message: "status is required!" }]}
          >
            <Select
              placeholder="status"
              size="large"
              onChange={(value) => handleFormChange("status", value)}
              options={[
                { label: "WORKING", value: "WORKING" },
                { label: "DAMAGED", value: "DAMAGED" },
                { label: "DISCARDED", value: "DISCARDED" },
                { label: "INSTORE", value: "INSTORE" },
                { label: "STOLEN", value: "STOLEN" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Description">
            <TextArea style={{ height: "200px" }}
              placeholder="description"
              onChange={(e) => handleFormChange("description", e.target.value)} />
          </Form.Item>

          <Form.Item label="Serial number">
            <Input
              placeholder="Enter asset serial number"
              onChange={(e) => handleFormChange("serial_number", e.target.value)} />
          </Form.Item>

          <Form.Item label="Price">
            <Input
              addonBefore={currencyPrefix}
              size="large"
              className="w-100"
              placeholder="Enter price"
              onChange={(e) => handleFormChange("price", e.target.value)} />
          </Form.Item>

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
            Add new asset item
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewAssetItem;