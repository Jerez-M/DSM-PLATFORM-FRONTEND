import { Button, Divider, Form, Modal, message, Select, AutoComplete } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import authenticationService from "../../../../../services/authentication.service";
import generalAssetsServices from "../../../../../services/general-assets.services";
import { refreshPage } from "../../../../../common";

const NewAssetCategory = ({ open, close }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: ""
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

      const { name } = formData;
      const data = {
        name,
        tenant,
      };
      console.log("form data: ", data);

      const response = await generalAssetsServices.createAssetCategory(data);

      if (response.status === 201) {
        refreshPage()
        message.success("New Asset Category Added Successfully");
      } else {
        console.log("Request was not successful. Status:", response.status);
        message.error("An error occurred, please check your network.");
      }
    } catch (error) {
      console.error("Error creating new asset category:", error);
      message.error(error ? error?.response?.data?.error : "An error occured, please check your network");
    } finally {
      setLoading(false);
      setDisabled(false);
      close();
    }
  };

  return (
    <>
      <Modal
        title="Add New Asset Category"
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
            label="Asset category name"
            name="name"
            rules={[{ required: true, message: "Term name is required!" }]}
          >
            <AutoComplete
              size="large"
              placeholder="Select term"
              onChange={(value) => handleFormChange("name", value)}
              filterOption={(inputValue, option) =>
                option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              showSearch
              options={[
                { label: "CHAIRS", value: "CHAIRS" },
                { label: "DESKS", value: "DESKS" },
                { label: "TABLES", value: "TABLES" },
                { label: "BOOKS", value: "BOOKS" },
                { label: "SPORTS EQUIPMENT", value: "SPORTS EQUIPMENT" },
                { label: "ART SUPPLIES", value: "ART SUPPLIES" },
                { label: "FURNITURE", value: "FURNITURE" },
                { label: "LOCKERS", value: "LOCKERS" },
                { label: "CABINETS", value: "CABINETS" },
                { label: "BOOKSHELVES", value: "BOOKSHELVES" },
                { label: "AIR CONDITIONERS", value: "AIR CONDITIONERS" },
                { label: "HEATERS", value: "HEATERS" },
                { label: "STORAGE BINS", value: "STORAGE BINS" },
                { label: "SMART BOARDS", value: "SMART BOARDS" },
                { label: "SCREENS", value: "SCREENS" },
                { label: "TENNIS TABLES", value: "TENNIS TABLES" },
                { label: "FOOTBALLS", value: "FOOTBALLS" },
                { label: "BASKETBALLS", value: "BASKETBALLS" },
                { label: "VOLLEYBALLS", value: "VOLLEYBALLS" },
                { label: "CRICKET EQUIPMENT", value: "CRICKET EQUIPMENT" },
                { label: "SWIMMING POOL EQUIPMENT", value: "SWIMMING POOL EQUIPMENT" },
                { label: "SCHOOL UNIFORMS", value: "SCHOOL UNIFORMS" },
                { label: "TEACHER SUPPLIES", value: "TEACHER SUPPLIES" },
                { label: "STUDENT SUPPLIES", value: "STUDENT SUPPLIES" },
                { label: "CLEANING SUPPLIES", value: "CLEANING SUPPLIES" },
                { label: "TOYS", value: "TOYS" },
                { label: "KITCHEN APPLIANCES", value: "KITCHEN APPLIANCES" },
                { label: "CRAFT MATERIALS", value: "CRAFT MATERIALS" },
                { label: "FIRST AID SUPPLIES", value: "FIRST AID SUPPLIES" },
                { label: "MATTRESSES", value: "MATTRESSES" },
                { label: "PENCILS", value: "PENCILS" },
                { label: "PENS", value: "PENS" },
                { label: "ERASERS", value: "ERASERS" },
                { label: "RULERS", value: "RULERS" },
                { label: "SCISSORS", value: "SCISSORS" },
                { label: "GLUE", value: "GLUE" },
                { label: "PAINTS", value: "PAINTS" },
                { label: "BRUSHES", value: "BRUSHES" },
                { label: "GLOBES", value: "GLOBES" },
                { label: "MAPS", value: "MAPS" },
                { label: "CHEMICALS", value: "CHEMICALS" },
                { label: "TEST TUBES", value: "TEST TUBES" },
                { label: "BUNSEN BURNERS", value: "BUNSEN BURNERS" },
                { label: "MICROSCOPE SLIDES", value: "MICROSCOPE SLIDES" },
                { label: "PAINTBRUSHES", value: "PAINTBRUSHES" },
                { label: "CANVAS", value: "CANVAS" },
                { label: "MUSICAL SCORES", value: "MUSICAL SCORES" },
                { label: "DRUMS", value: "DRUMS" },
                { label: "GUITARS", value: "GUITARS" },
                { label: "PIANOS", value: "PIANOS" },
                { label: "TRUMPETS", value: "TRUMPETS" },
                { label: "VIOLINS", value: "VIOLINS" },
                { label: "PLAYGROUND EQUIPMENT", value: "PLAYGROUND EQUIPMENT" },
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
            icon={<PlusOutlined />}
            block
            htmlType="submit"
          >
            Add new asset category
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default NewAssetCategory;