import { Button, Form, Input, Modal, Select, message, Steps, DatePicker, InputNumber } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import AuthenticationService from "../../../../services/authentication.service";
import {
    capitalize,
    currencyPrefix,
    handleJerryError,
    refreshPage,
    toInputUppercase
} from "../../../../common";
import VEHICLE_AVAILABILITY from "../../../../utils/vehicle-availability";
import VEHICLE_TYPE from "../../../../utils/vehicle-type";
import VEHICLE_FUEL_TYPE from "../../../../utils/vehicle-fuel-type";
import VEHICLE_DRIVE from "../../../../utils/vehicle-drive";
import VEHICLE_TRANSMISSION from "../../../../utils/vehicle-transmission";
import { VEHICLE_CONDITION } from "../../../../utils/vehicle-condition";
import TextArea from "antd/es/input/TextArea";
import VehicleService from "../../../../services/vehicle.service";
import dayjs from "dayjs";

const NewVehicle = ({ open, close, vehicle }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        form.setFieldsValue({ "expert_given_value": purchasePrice })
    }, [purchasePrice]);

    const handleFormSubmit = async (values) => {
        if (current < 2) {
            next()
        } else {
            try {
                const requestData = {
                    ...formData,
                    ...values,
                    institution: AuthenticationService.getUserTenantId(),
                };
                setLoading(true)
                if (vehicle?.id) {
                    const response = await VehicleService.update(vehicle.id, requestData);
                    if (response.status === 200) {
                        message.success("Vehicle Updated Successfully");
                        refreshPage()
                    }
                } else {
                    const response = await VehicleService.create(requestData);
                    if (response.status === 201) {
                        message.success("Vehicle Added Successfully");
                        refreshPage()
                    }
                }
                close();
            } catch (error) {
                handleJerryError(error)
            } finally {
                setLoading(false);
            }
        }
    };

    const step = (
        <>
            <div className="row">
                <div className="col-md-4">
                    <Form.Item
                        label="Manufacturer"
                        name="manufacturer"
                        rules={[{ required: (vehicle === null), message: 'Manufacturer is required!' }]}
                        initialValue={vehicle && vehicle.manufacturer}
                    >
                        <Input
                            size="large"
                            placeholder="Manufacturer"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-4">
                    <Form.Item
                        name="make"
                        label="Make"
                        rules={[{ required: (vehicle === null), message: 'Make is required!' }]}
                        initialValue={vehicle?.make}
                    >
                        <Input
                            size="large"
                            placeholder="Make"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-4">
                    <Form.Item
                        name="model"
                        label="Model"
                        rules={[{ required: (vehicle === null), message: 'Model is required!' }]}
                        initialValue={vehicle?.model}
                    >
                        <Input
                            size="large"
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
                        rules={[{ required: (vehicle === null), message: 'Name is required!' }]}
                        initialValue={vehicle?.name}
                    >
                        <Input
                            size="large"
                            placeholder="e.g. Staff Bus"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: (vehicle === null), message: 'Vehicle type is required!' }]}
                        initialValue={vehicle?.type}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Type"
                            options={VEHICLE_TYPE.map((type) => (
                                { value: type, label: capitalize(type) }
                            ))}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="production_year"
                        label="Production Year"
                        getValueFromEvent={(e) => e?.format("YYYY-MM-DD")}
                        getValueProps={(e) => ({
                            value: e ? dayjs(e) : "",
                        })}
                        initialValue={vehicle?.production_year}
                    >
                        <DatePicker
                            size="large"
                            picker="year"
                            className="w-100"
                            placeholder="Production Year"
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="purchased_date"
                        label="Purchase Date"
                        getValueFromEvent={(e) => e?.format("YYYY-MM-DD")}
                        getValueProps={(e) => ({
                            value: e ? dayjs(e) : "",
                        })}
                        rules={[{ required: (vehicle === null), message: 'Purchased date is required!' }]}
                        initialValue={vehicle && vehicle?.purchased_date}
                    >
                        <DatePicker
                            size="large"
                            className="w-100"
                            placeholder="Purchase Date"
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="purchase_millage"
                        label="Purchase Millage"
                        initialValue={vehicle?.purchase_millage}
                    >
                        <InputNumber
                            suffix="KM"
                            size="large"
                            type="number"
                            className="w-100"
                            placeholder="Purchase Millage"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="current_millage"
                        label="Current Millage"
                        rules={[{ required: (vehicle === null), message: 'Current Millage is required!' }]}
                        initialValue={vehicle?.current_millage}
                    >
                        <InputNumber
                            suffix="KM"
                            size="large"
                            type="number"
                            className="w-100"
                            placeholder="Current Millage"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="numberplate"
                        label="Numberplate"
                        rules={[{ required: (vehicle === null), message: 'Numberplate is required!' }]}
                        initialValue={vehicle && vehicle.numberplate}
                    >
                        <Input
                            size="large"
                            placeholder="Numberplate"
                            onInput={toInputUppercase}
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="registration_number"
                        label="Registration Number"
                        initialValue={vehicle?.registration_number}
                    >
                        <Input
                            size="large"
                            onInput={toInputUppercase}
                            placeholder="Registration Number"
                        />
                    </Form.Item>
                </div>
            </div>
        </>
    )

    const stepTwo = (
        <>
            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="purchase_price"
                        label="Purchase Price"
                        rules={[{ required: (vehicle === null), message: 'Purchased price value is required!' }]}
                        initialValue={vehicle?.purchase_price}
                    >
                        <InputNumber
                            addonBefore={currencyPrefix}
                            onChange={(value) => setPurchasePrice(value)}
                            size="large"
                            type="number"
                            className="w-100"
                            placeholder="Purchase Price"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="depreciation"
                        label="Yearly depreciation rate"
                        rules={[{ required: (vehicle === null), message: 'Depreciation value is required!' }]}
                        initialValue={vehicle && vehicle.depreciation}
                    >
                        <InputNumber
                            suffix="%"
                            size="large"
                            precision={2}
                            className="w-100"
                            placeholder="Depreciation"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="user_estimated_latest_valuation"
                        label="Estimated current value"
                        rules={[{ required: (vehicle === null), message: 'Estimated current value is required!' }]}
                        initialValue={vehicle && vehicle.user_estimated_latest_valuation}
                    >
                        <InputNumber
                            size="large"
                            type="number"
                            className="w-100"
                            placeholder="Estimated current value"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="salvage_price"
                        label="Salvage Price"
                        initialValue={vehicle?.salvage_price}
                    >
                        <Input
                            type="number"
                            size="large"
                            placeholder="Salvage Price"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="chassis_number"
                        label="Chassis Number"
                        initialValue={vehicle && vehicle.chassis_number}
                    >
                        <Input
                            size="large"
                            onInput={toInputUppercase}
                            placeholder="Chassis Number"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="engine_number"
                        label="Engine Number"
                        initialValue={vehicle?.engine_number}
                    >
                        <Input
                            size="large"
                            onInput={toInputUppercase}
                            placeholder="Engine Number"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="color"
                        label="Color"
                        rules={[{ required: (vehicle === null), message: 'Color is required!' }]}
                        initialValue={vehicle && vehicle?.color}
                    >
                        <Input
                            size="large"
                            placeholder="Color"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="availability"
                        label="Availability"
                        initialValue={vehicle?.availability || "AVAILABLE"}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Availability"
                            options={VEHICLE_AVAILABILITY.map((availability) => (
                                { value: availability, label: capitalize(availability) }
                            ))}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="condition"
                        label="Condition"
                        initialValue={vehicle?.condition || "WORKING"}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Color"
                            options={VEHICLE_CONDITION.map(condition => (
                                { value: condition, label: capitalize(condition) }
                            ))}
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="vin"
                        label="Vin"
                        initialValue={vehicle?.vin}
                    >
                        <Input
                            size="large"
                            placeholder="Vin"
                            onInput={toInputUppercase}
                        />
                    </Form.Item>
                </div>
            </div>
        </>
    )

    const stepThree = (
        <>
            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="net_weight"
                        label="Net Weight"
                        initialValue={vehicle?.net_weight}
                    >
                        <InputNumber
                            suffix="KG"
                            size="large"
                            className="w-100"
                            placeholder="Net Weight"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="carry_weight"
                        label="Carry Weight"
                        initialValue={vehicle?.carry_weight}
                    >
                        <InputNumber
                            suffix="KG"
                            size="large"
                            className="w-100"
                            placeholder="Carry Weight"
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="fuel_capacity"
                        label="Fuel Capacity"
                        initialValue={vehicle?.fuel_capacity}
                    >
                        <InputNumber
                            suffix="L"
                            size="large"
                            className="w-100"
                            placeholder="Fuel Capacity"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="fuel_type"
                        label="Fuel Type"
                        initialValue={vehicle?.fuel_type}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Fuel Type"
                            options={VEHICLE_FUEL_TYPE.map((fuel_type) => (
                                { value: fuel_type, label: capitalize(fuel_type) }
                            ))}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="drive"
                        label="Drive"
                        initialValue={vehicle?.drive}
                    >
                        <Select
                            allowClear
                            size="large"
                            className="w-100"
                            placeholder="Drive"
                            options={VEHICLE_DRIVE.map((drive) => (
                                { value: drive, label: capitalize(drive) }
                            ))}
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="transmission"
                        label="Transmission"
                        initialValue={vehicle?.transmission}
                    >
                        <Select
                            allowClear
                            size="large"
                            placeholder="Transmission"
                            options={VEHICLE_TRANSMISSION.map((transmission) => (
                                { value: transmission, label: capitalize(transmission) }
                            ))}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Item
                        name="engine_size"
                        label="Engine Size"
                        initialValue={vehicle?.engine_size}
                    >
                        <InputNumber
                            suffix="CC"
                            size="large"
                            className="w-100"
                            placeholder="Engine Size"
                        />
                    </Form.Item>
                </div>
                <div className="col-md-6">
                    <Form.Item
                        name="number_of_seats"
                        label="Seating Capacity"
                        initialValue={vehicle?.number_of_seats}
                    >
                        <InputNumber
                            size="large"
                            className="w-100"
                            placeholder="Seating Capacity"
                        />
                    </Form.Item>
                </div>
            </div>

            <Form.Item
                name="description"
                label="Description"
                initialValue={vehicle?.description}
            >
                <TextArea
                    size="large"
                    placeholder="Description"
                />
            </Form.Item>
        </>
    )

    const steps = [
        {
            title: 'Identification',
            content: step,
            forceRender: true,
        },
        {
            title: 'Details',
            content: stepTwo,
            forceRender: true,
        },
        {
            title: 'Last',
            content: stepThree,
            forceRender: true,
        },
    ];

    const next = () => {
        setFormData({ ...formData, ...form.getFieldsValue() })
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const handleClear = () => {
        form.resetFields();
    }

    const handleNext = () => {
        form.validateFields()
            .then(() => {
                form.submit();
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <>
            <Modal
                title={vehicle ? "Edit vehicle" : "Add new vehicle"}
                open={open}
                width={800}
                onCancel={() => {
                    handleClear();
                    close()
                }}
                forceRender
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
                    forceRender
                >
                    <Steps forceRender current={current} items={items} />
                    <div className="steps-content mt-4">{steps[current].content}</div>
                    <div className="steps-action mt-3 d-flex justify-content-end">
                        {current > 0 && (
                            <Button
                                size="large"
                                style={{ margin: "0 8px" }}
                                onClick={() => prev()}
                                icon={<ArrowLeftOutlined />}
                            >
                                Previous
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button
                                size="large"
                                type="primary"
                                onClick={handleNext}
                                icon={<ArrowRightOutlined />}
                            >
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default NewVehicle;
