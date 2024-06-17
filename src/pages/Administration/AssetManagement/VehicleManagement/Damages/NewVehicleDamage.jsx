import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import VehicleService from "../../../../../services/vehicle.service";
import AuthenticationService from "../../../../../services/authentication.service";
import {currencyPrefix, dateFormat, handleJerryError, refreshPage, toHumanDate} from "../../../../../common";
import {VEHICLE_DAMAGE_SEVERITY, VEHICLE_REPAIR_STATUS} from "../../../../../utils/vehicle-damage";
import VehicleDamageService from "../../../../../services/vehicle-damage.service";
import dayjs from "dayjs";
import TripService from "../../../../../services/trip.service";
import AdministratorService from "../../../../../services/administrator.service";

const NewVehicleDamage = ({open, close, vehicleDamage, vehicleId}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([])
    const [vehicle, setVehicle] = useState(null)
    const [drivers, setDrivers] = useState([])
    const [trips, setTrips] = useState([])

    const tenantId = AuthenticationService.getUserTenantId();

    useEffect(() => {
        if(vehicleDamage) {
            form.setFieldsValue({
                "vehicle": vehicleDamage.vehicle?.id,
                "damage_severity": vehicleDamage.damage_severity,
                "repair_status": vehicleDamage.repair_status,
                "trip": vehicleDamage.trip?.id,
                "currency": vehicleDamage.currency,
                "estimated_damage_cost": vehicleDamage.estimated_damage_cost,
                "description": vehicleDamage.description,
            })

            if(vehicleDamage.damage_date) {
                form.setFieldsValue({"damage_date": vehicleDamage.damage_date});
            }

            setVehicle(vehicleDamage.vehicle?.id)
        }
    }, [vehicleDamage])

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

        AdministratorService.getAllNonStudentAccountsByInstitution(tenantId)
            .then(response => {
                const drivers = response.data.map(admin => (
                    {value: admin.id, label: `${admin.firstName} ${admin.lastName}`}
                ))
                setDrivers(drivers)
            })
            .catch(e => {
                console.log(e)
            })
    }, []);

    useEffect(() => {
        if(vehicleId || vehicle) {
            TripService.getTripsByVehicleId(vehicleId || vehicle)
                .then(response => {
                    const trips = response.data?.map(trip => (
                        {value: trip.id, label: `${trip.destination} - (${toHumanDate(trip.start_date)})`}
                    ))
                    setTrips(trips)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }, [vehicle, vehicleId]);

    const handleFormSubmit = async (values) => {

        try {
            const requestData = {
                ...values,
                institution: tenantId,
            };
            setLoading(true)
            if(vehicleDamage?.id) {
                const response = await VehicleDamageService.update(vehicleDamage.id, requestData);
                if (response.status === 200) {
                    message.success("Damage Updated Successfully");
                    setLoading(false);
                    refreshPage();
                    close();
                }
            } else {
                const response = await VehicleDamageService.create(requestData);
                if (response.status === 201) {
                    message.success("Damage Added Successfully");
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
            title={vehicleDamage ? "Edit Damage" : "Add new damage"}
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
                    rules={[{ required: (vehicleDamage !== null), message: 'Vehicle is required!' }]}
                    initialValue={vehicleId}
                >
                    <Select
                        onChange={(value) => setVehicle(value)}
                        size="large"
                        placeholder="Vehicle"
                        options={vehicles}
                        allowClear
                    />
                </Form.Item>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="damage_severity"
                            label="Damage Severity"
                            initialValue={vehicleDamage?.severity || "MINOR"}
                            rules={[{ required: (vehicleDamage !== null), message: 'Damage Severity is required!' }]}
                        >
                            <Select
                                allowClear
                                size="large"
                                placeholder="Severity"
                                options={VEHICLE_DAMAGE_SEVERITY.map((severity) => (
                                    {value: severity, label: severity}
                                ))}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="repair_status"
                            label="Repair Status"
                            initialValue={vehicleDamage?.repairStatus || "NOT FIXED"}
                            rules={[{ required: (vehicleDamage !== null), message: 'Repair status is required!' }]}
                        >
                            <Select
                                allowClear
                                size="large"
                                placeholder="Status"
                                options={VEHICLE_REPAIR_STATUS.map((status) => (
                                    {value: status, label: status}
                                ))}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="users_responsible"
                            label="People Responsible"
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                size="large"
                                placeholder="People Responsible"
                                options={drivers}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="trip"
                            label="Trip"
                        >
                            <Select
                                allowClear
                                size="large"
                                placeholder="Trip"
                                options={trips}
                            />
                        </Form.Item>

                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="estimated_damage_cost"
                            label="Estimated Cost"
                        >
                            <InputNumber
                                addonBefore={currencyPrefix}
                                size="large"
                                className="w-100"
                                placeholder="Estimated Cost"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="damage_date"
                            label="Damage Date"
                            rules={[{ required: (vehicleDamage !== null), message: 'Damage date is required!' }]}
                            getValueFromEvent={(e) => e?.format(dateFormat)}
                            getValueProps={(e) => ({
                                value: e ? dayjs(e) : "",
                            })}
                        >
                            <DatePicker
                                className="w-100"
                                size="large"
                                placeholder="Date Of Damage"
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: (vehicleDamage !== null), message: 'Damage Description is required!' }]}
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
                    {vehicleDamage ? "Edit vehicle damage" : "Add new vehicle damage"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewVehicleDamage;