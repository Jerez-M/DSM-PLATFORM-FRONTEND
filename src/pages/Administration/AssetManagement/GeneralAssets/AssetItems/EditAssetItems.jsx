import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  message,
  Select,
} from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import authenticationService from "../../../../../services/authentication.service";
import generalAssetsServices from "../../../../../services/general-assets.services";
import TextArea from "antd/es/input/TextArea";

const EditAssetItem = ({ open, close, record }) => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [category, setCategory] = useState([]);
  const{id} = useParams()
  
  const [formData, setFormData] = useState({
    purchase_date: record ? record?.purchase_date : null,
    asset_no: record ? record?.asset_no : null,
    price: record ? record?.price : '',
    serial_number: record ? record?.serial_number: '',
    status: record ? record?.status : '',
    description: record ? record?.description : '',
  });

  const tenant = authenticationService.getUserTenantId();

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

      const { purchase_date, asset_no, price, serial_number, status, description} = formData;
      const data = {
        purchase_date: purchase_date || record?.purchase_date,
        asset_no: asset_no || record?.asset_no,
        price: price || record?.price,
        serial_number: serial_number || record?.serial_number,
        tenant,
        category: category?.id || category?.id,
        status: status || record?.status,
        description: description || record?.description,
      };

      const id = record?.id;
      console.log("form data: ", data, record?.status, "asset_no", record?.asset_no);

      const response = await generalAssetsServices.updateAssetItem(id, data);

      if (response.status === 200) {
        message.success("Asset item updated successfully");
        window.location.reload();
      } else {
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error updating asset item:", error);
      message.error(error ? error?.response?.data?.error : "An error occured while updating asset item, please check your network");
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
      console.log("category id is: ", id)
      const response = await generalAssetsServices.getAssetCategory(id);

      if (response.status === 200) {
          setCategory(response.data);
      } else {
        console.log("Error occured during fetching asset item")
      }
    } catch (error) {
      console.error("Error occured during fetching asset item:", error);
    }
  };

  return (
    <>
      <Modal
        title="Update Asset Item"
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
          <Form.Item label="Asset Category">
            <Select
              size="large"
              // onChange={(value) => handleFormChange("name", value)}
              defaultValue={category ? category?.name : "please select category"}
              options={[
                { label: category?.name, value: category?.id },
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
              // defaultValue={record ? record?.purchase_date: "Select purchase date"}
            />
          </Form.Item>
          <Form.Item
            label="status"
            name="status"
          >
            <Select
              size="large"
              onChange={(value) => handleFormChange("status", value)}
              defaultValue={record ? record?.status: "Select status"}
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
              onChange={(e) => handleFormChange("description", e.target.value)} 
              defaultValue={record ? record?.description: "Enter new description"}
            />
          </Form.Item>

          <Form.Item label="Serial number">
            <Input
              defaultValue={record ? record?.serial_number: "Enter new serial number"}
              onChange={(e) => handleFormChange("serial_number", e.target.value)} />
          </Form.Item>

          <Form.Item label="Price">
            <Input
              onChange={(e) => handleFormChange("price", e.target.value)} 
              defaultValue={record ? record?.price: "Enter new price"}
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
            Update asset item
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditAssetItem;
