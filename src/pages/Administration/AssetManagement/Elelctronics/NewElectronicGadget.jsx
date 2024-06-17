import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import AuthenticationService from "../../../../services/authentication.service";
import {
    capitalize,
    currencyPrefix,
    dateFormat,
    handleError,
    refreshPage,
    toInputUppercase
} from "../../../../common";
import ElectronicsService from "../../../../services/electronics.service";
import {ELECTRONIC_DEVICE_STATUS} from "../../../../utils/electronics";
import TextArea from "antd/es/input/TextArea";
import ElectronicsSupplierService from "../../../../services/electronics-supplier.service";
import dayjs from "dayjs";
import ElectronicsCategoryService from "../../../../services/electronics-category.service";

const NewElectronicGadget = ({open, close, gadget}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([])
    const [categories, setCategories] = useState([])

    const tenantId = AuthenticationService.getUserTenantId();

    useEffect(() => {
        if(gadget?.id) {
            form.setFieldsValue({
                "name": gadget?.name,
                "type": gadget?.type?.id,
                "manufacturer": gadget?.manufacturer,
                "model": gadget?.model,
                "model_number": gadget?.model_number,
                "serial_number": gadget?.serial_number,
                "supplier": gadget?.supplier?.id,
                "purchase_date": gadget?.purchase_date,
                "warranty_expiration_date": gadget?.warranty_expiration_date,
                "purchase_price": gadget?.purchase_price,
                "salvage_price": gadget?.salvage_price,
                "depreciation_rate": gadget?.depreciation_rate,
                "status": gadget?.status,
                "description": gadget?.description,
            })
        }
    }, [gadget])

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true)
            const suppliersResponse = await ElectronicsSupplierService.getAllByInstitution()
            const categoriesResponse = await ElectronicsCategoryService.getAllByInstitution()

            const suppliersList = suppliersResponse?.data?.map(supplier => (
                {value: supplier.id, label: supplier.supplier_name}
            ))
            setSuppliers(suppliersList)

            const categoriesList = categoriesResponse?.data?.map(category => (
                {value: category.id, label: category.name}
            ))
            setCategories(categoriesList)
        } catch (e) {
            setSuppliers([])
        } finally {
            setLoading(false)
        }
    }

    const handleFormSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {...values, institution: tenantId};

            if (gadget?.id) {
                const response = await ElectronicsService.update(gadget?.id, requestData);

                if(response.status === 200) {
                    message.success("Electric Gadget Updated Successfully")
                    refreshPage()
                }
            } else {
                const response = await ElectronicsService.create(requestData);

                if(response.status === 201) {
                    message.success("Electric Gadget Created Successfully")
                    refreshPage()
                }
            }
        } catch (e) {
            handleError(e)
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        form.resetFields();
    }

    return (
        <Modal
            title={gadget?.id ? "Edit Electronic Gadget" : "Add New Electronic Gadget"}
            open={open}
            onCancel={() => {
                handleClear();
                close()
            }}
            width={800}
            okButtonProps={{
                className: "d-none",
            }}
            cancelButtonProps={{
                className: "d-none",
            }}
            maskClosable
            destroyOnClose
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleFormSubmit}
            >

                <div className="row">
                    <div className="col-md-4">
                        <Form.Item
                            name="manufacturer"
                            label="Manufacturer"
                            rules={[{ required: true, message: 'Manufacturer is required!' }]}
                        >
                            <Input
                                size="large"
                                className="w-100"
                                placeholder="Manufacturer"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            name="model"
                            label="Model"
                        >
                            <Input
                                size="large"
                                onInput={toInputUppercase}
                                className="w-100"
                                placeholder="Model"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-4">
                        <Form.Item
                            name="model_number"
                            label="Model Number"
                        >
                            <Input
                                size="large"
                                onInput={toInputUppercase}
                                className="w-100"
                                placeholder="Model"
                            />
                        </Form.Item>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Electronic Gadget Name is required!' }]}
                        >
                            <Input
                                size="large"
                                placeholder="e.g. Main Office Printer"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            name="type"
                            label="Category"
                            rules={[{ required: true, message: 'Electronic category is required!' }]}
                        >
                            <Select
                                size="large"
                                placeholder="Category"
                                options={categories}
                                allowClear
                            />
                        </Form.Item>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            name="serial_number"
                            label="Serial Number"
                            rules={[{ required: true, message: 'Serial number is required!' }]}
                        >
                            <Input
                                size="large"
                                onInput={toInputUppercase}
                                className="w-100"
                                placeholder="Serial Number"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            name="supplier"
                            label="Supplier"
                        >
                            <Select
                                size="large"
                                className="w-100"
                                placeholder="Supplier"
                                options={suppliers}
                                allowClear
                            />
                        </Form.Item>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            name="purchase_date"
                            label="Purchase Date"
                            getValueFromEvent={(e) => e?.format(dateFormat)}
                            getValueProps={(e) => ({
                                value: e ? dayjs(e) : "",
                            })}
                        >
                            <DatePicker
                                className="w-100"
                                size="large"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            name="warranty_expiration_date"
                            label="Warranty Expiration Date"
                            getValueFromEvent={(e) => e?.format(dateFormat)}
                            getValueProps={(e) => ({
                                value: e ? dayjs(e) : "",
                            })}
                        >
                            <DatePicker
                                className="w-100"
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            name="purchase_price"
                            label="Purchase Price"
                            rules={[{ required: true, message: 'Purchase Price is required!' }]}
                        >
                            <InputNumber
                                addonBefore={currencyPrefix}
                                size="large"
                                className="w-100"
                                placeholder="Purchase Price"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-md-6">
                        <Form.Item
                            name="salvage_price"
                            label="Salvage Price"
                            rules={[{ required: true, message: 'Salvage Price is required!' }]}
                        >
                            <InputNumber
                                size="large"
                                className="w-100"
                                placeholder="Salvage Price"
                            />
                        </Form.Item>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <Form.Item
                            name="depreciation_rate"
                            label="Depreciation"
                        >
                            <InputNumber
                                suffix="%"
                                size="large"
                                className="w-100"
                                placeholder="Depreciation"
                            />
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item
                            name="status"
                            label="Status"
                            initialValue={gadget?.status || "WORKING"}
                        >
                            <Select
                                size="large"
                                className="w-100"
                                placeholder="Status"
                                options={ELECTRONIC_DEVICE_STATUS.map((type) => (
                                    {value: type, label: capitalize(type)}
                                ))}
                            />
                        </Form.Item>
                    </div>
                </div>


                <Form.Item
                    name="description"
                    label="Description"
                >
                    <TextArea
                        size="large"
                        placeholder="Description"
                    />
                </Form.Item>

                <Button
                    icon={<PlusOutlined/>}
                    type="primary"
                    size="large"
                    loading={loading}
                    block
                    htmlType="submit"
                >
                    {gadget?.id ? "Edit Electronic Gadget" : "Add New Electronic Gadget"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewElectronicGadget;