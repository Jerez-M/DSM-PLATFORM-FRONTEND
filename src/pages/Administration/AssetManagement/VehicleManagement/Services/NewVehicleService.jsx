import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import VehicleService from "../../../../../services/vehicle.service";
import AuthenticationService from "../../../../../services/authentication.service";
import {dateFormat, currencyPrefix, handleJerryError, refreshPage} from "../../../../../common";
import {VEHICLE_SERVICE_TYPE} from "../../../../../utils/vehicle-service";
import VehicleServiceService from "../../../../../services/vehicle-service.service";
import dayjs from "dayjs";
import VehicleDamageService from "../../../../../services/vehicle-damage.service";

const NewVehicleService = ({open, close, vehicleService, vehicleId}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([])
    const [damages, setDamages] = useState([])
    const [vehicle, setVehicle] = useState(vehicleId)
    const [serviceType, setServiceType] = useState(null)

    const tenantId = AuthenticationService.getUserTenantId();

    useEffect(() => {
        if(vehicleService) {
            form.setFieldsValue({
                "vehicle": vehicleService.vehicle?.id,
                "service_type": vehicleService.service_type,
                "currency": vehicleService.currency,
                "cost": vehicleService.cost,
                "service_provider": vehicleService.service_provider,
                "damage": vehicleService.damage?.id,
                "notes": vehicleService.notes,
                "millage": vehicleService.millage,
            })
            
            if(vehicleService.date_of_service) {
                form.setFieldsValue({"date_of_service": vehicleService.date_of_service})
            }

            setVehicle(vehicleService.vehicle?.id)
            setServiceType(vehicleService.service_type)
        }
    }, [vehicleService])

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

    useEffect(() => {
        if(vehicleId || vehicle) {
            VehicleDamageService.getDamagesByVehicleId(vehicleId || vehicle)
                .then(response => {
                    const damages = response.data?.map(damage => {
                        return {value: damage.id, label: `${damage.description}`}
                    })
                    setDamages(damages)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [vehicle]);

    const handleFormSubmit = async (values) => {
        try {
            const requestData = {
                ...values,
                institution: tenantId,
            };
            setLoading(true)
            if(vehicleService?.id) {
                const response = await VehicleServiceService.update(vehicleService.id, requestData);
                if (response.status === 200) {
                    message.success("Service Updated Successfully");
                    setLoading(false);
                    refreshPage();
                    close();
                }
            } else {
                const response = await VehicleServiceService.create(requestData);
                if (response.status === 201) {
                    message.success("Service Added Successfully");
                    setLoading(false);
                    refreshPage()
                    close();
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
            title={vehicleService ? "Edit service" : "Add new service"}
            open={open}
            width={700}
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
                    rules={[{ required: (vehicleService !== null), message: 'Vehicle is required!' }]}
                    initialValue={vehicleId}
                >
                    <Select
                        allowClear
                        onChange={(value) => setVehicle(value)}
                        size="large"
                        placeholder="Vehicle"
                        options={vehicles}
                    />
                </Form.Item>

                <Form.Item
                    name="service_type"
                    label="Service Type"
                    rules={[{ required: (vehicleService !== null), message: 'Service Type is required!' }]}
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Service Type"
                        onChange={(value) => setServiceType(value)}
                        options={VEHICLE_SERVICE_TYPE.map((type) => (
                            {value: type, label: type}
                        ))}
                    />
                </Form.Item>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="date_of_service"
                            label="Date Of Service"
                            getValueFromEvent={(e) => e?.format(dateFormat)}
                            getValueProps={(e) => ({
                                value: e ? dayjs(e) : "",
                            })}
                        >
                            <DatePicker
                                className="w-100"
                                size="large"
                                placeholder="Date Of Service"
                                format={dateFormat}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="cost"
                            label="Cost"
                        >
                            <InputNumber
                                addonBefore={currencyPrefix}
                                size="large"
                                className="w-100"
                                placeholder="Cost"
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="service_provider"
                    label="Service Provider"
                >
                    <Input
                        size="large"
                        placeholder="Service Provider Details"
                    />
                </Form.Item>

                <Form.Item
                    name="millage"
                    label="Millage"
                >
                    <InputNumber
                        size="large"
                        className="w-100"
                        placeholder="Millage"
                    />
                </Form.Item>

                {serviceType === "REPAIR" && <Form.Item
                    name="damage"
                    label="Damage"
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Damage"
                        options={damages}
                    />
                </Form.Item>}

                <Form.Item
                    name="notes"
                    label="Notes"
                >
                    <Input.TextArea
                        size="large"
                        placeholder="Notes"
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
                    {vehicleService ? "Edit vehicle service" : "Add new vehicle service"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewVehicleService;