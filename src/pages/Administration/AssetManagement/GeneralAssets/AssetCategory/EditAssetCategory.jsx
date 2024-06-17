import {
  Button,
  Form,
  Modal,
  message,
  Select,
} from "antd";
import { useState } from "react";
import generalAssetsServices from "../../../../../services/general-assets.services";


const EditAssetCategory = ({ open, close, record }) => {
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

      const response = await generalAssetsServices.updateAssetCategory(id, data);

      if (response.status === 200) {
        message.success("Asset category updated successfully");
        window.location.reload();
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
        title="Update Asset Category"
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
          <Form.Item label="Asset category">
            <Select
              size="large"
              defaultValue={record ? record?.name : "please select category"}
              onChange={(value) => handleFormChange("name", value)}
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
         
          <Button
            type="primary"
            size="large"
            className="mt-3"
            loading={loading}
            disabled={disabled}
            block
            onClick={handleFormSubmit}
          >
            Update asset category
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default EditAssetCategory;
