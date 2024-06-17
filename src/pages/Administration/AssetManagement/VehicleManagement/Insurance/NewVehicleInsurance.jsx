import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import VehicleService from "../../../../../services/vehicle.service";
import AuthenticationService from "../../../../../services/authentication.service";
import {currencyPrefix, dateFormat, handleJerryError, refreshPage} from "../../../../../common";
import dayjs from "dayjs";
import VehicleInsuranceService from "../../../../../services/vehicle-insurance.service";

const NewVehicleInsurance = ({open, close, vehicleInsurance, vehicleId}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([])

    const tenantId = AuthenticationService.getUserTenantId();

    useEffect(() => {
        if(vehicleInsurance) {
            form.setFieldsValue({
                "vehicle": vehicleInsurance.vehicle?.id,
                "currency": vehicleInsurance.currency,
                "amount": vehicleInsurance.amount,
                "description": vehicleInsurance.description,
            })

            if(vehicleInsurance.damage_date) {
                form.setFieldsValue({"purchased_date": vehicleInsurance.purchased_date});
                form.setFieldsValue({"expiry_date": vehicleInsurance.expiry_date});
            }
        }
    }, [vehicleInsurance])

    useEffect(() => {
        VehicleService.getAllByInstitution(tenantId)
            .then(response => {
                const vehicleData = response.data.map(vehicle => (
                    {value: vehicle.id, label: `${vehicle?.manufacturer} ${vehicle?.make} ${vehicle?.model}  (${vehicle.numberplate})`}
                ))
                setVehicles(vehicleData)
            })
            .catch(e => {
                console.log(e)
            })
    }, []);

    const handleFormSubmit = async (values) => {
        try {
            const requestData = {
                ...values,
                institution: tenantId,
            };
            setLoading(true)
            if(vehicleInsurance?.id) {
                const response = await VehicleInsuranceService.update(vehicleInsurance.id, requestData);
                if (response.status === 200) {
                    message.success("Insurance Updated Successfully");
                    setLoading(false);
                    refreshPage();
                    close();
                }
            } else {
                const response = await VehicleInsuranceService.create(requestData);
                if (response.status === 201) {
                    message.success("Insurance Added Successfully");
                    setLoading(false);
                    refreshPage()
                }
            }
        } catch (error) {
            setLoading(false);
            handleJerryError(error)
        }
    }

    const handleClear = () => {
        form.resetFields();
    }

    return (
        <Modal
            title={vehicleInsurance ? "Edit Insurance" : "Add new Insurance"}
            open={open}
            width={800}
            onCancel={() => {
                handleClear();
                close()
            }}
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
                <Form.Item
                    name="vehicle"
                    label="Vehicle"
                    initialValue={vehicleId}
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Vehicle"
                        options={vehicles}
                    />
                </Form.Item>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: (vehicleInsurance !== null), message: 'Insurance Name is required!' }]}
                        >
                            <Input
                                size="large"
                                placeholder="Name"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="amount"
                            label="Amount"
                        >
                            <InputNumber
                                addonBefore={currencyPrefix}
                                size="large"
                                className="w-100"
                                placeholder="Amount"
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="purchased_date"
                            label="Purchased Date"
                            getValueFromEvent={(e) => e?.format(dateFormat)}
                            getValueProps={(e) => ({
                                value: e ? dayjs(e) : "",
                            })}
                        >
                            <DatePicker
                                className="w-100"
                                size="large"
                                placeholder="Purchased Date"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="expiry_date"
                            label="Expiry Date"
                            getValueFromEvent={(e) => e?.format(dateFormat)}
                            getValueProps={(e) => ({
                                value: e ? dayjs(e) : "",
                            })}
                        >
                            <DatePicker
                                className="w-100"
                                size="large"
                                placeholder="Expiry Date"
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea
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
                    {vehicleInsurance ? "Edit Vehicle Insurance" : "Add new Vehicle Insurance"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewVehicleInsurance;