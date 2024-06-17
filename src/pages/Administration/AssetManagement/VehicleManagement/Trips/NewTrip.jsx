import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import VehicleService from "../../../../../services/vehicle.service";
import AuthenticationService from "../../../../../services/authentication.service";
import {capitalize, handleJerryError, refreshPage} from "../../../../../common";
import AdministratorService from "../../../../../services/administrator.service";
import dayjs from "dayjs";
import TRIP_PURPOSE from "../../../../../utils/trip-purpose";
import TripService from "../../../../../services/trip.service";

const NewTrip = ({open, close, vehicle}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([])
    const [allVehicles, setAllVehicles] = useState([])
    const [formVehicle, setFormVehicle] = useState(null)
    const [drivers, setDrivers] = useState([])
    const [admins, setAdmins] = useState([])

    const tenantId = AuthenticationService.getUserTenantId();

    useEffect(() => {
        VehicleService.getAllByInstitution(tenantId)
            .then(response => {
                const vehicleData = response.data.map(vehicle1 => (
                    {
                        value: vehicle1.id,
                        label: `${vehicle1.manufacturer} ${vehicle1?.make} ${vehicle1.model} (${vehicle1.numberplate})`,
                    }
                ))
                setAllVehicles(response.data)
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

        AdministratorService.getAllAdministratorsByInstitution(tenantId)
            .then(response => {
                const admins = response.data.map(admin => (
                    {value: admin.id, label: `${admin.user?.firstName[0]} ${admin.user?.lastName}`}
                ))
                setAdmins(admins)
            })
            .catch(e => {
                console.log(e)
            })
    }, []);

    useEffect(() => {
        if(vehicle && !formVehicle) {
            form.setFieldsValue({"millage_at_start":  vehicle.current_millage})
        }
        if(formVehicle) {
            const vehicleMillage = allVehicles?.find(car => car.id === formVehicle)?.current_millage;
            form.setFieldsValue({"millage_at_start":  vehicleMillage})
        }
    }, [formVehicle])

    const handleFormSubmit = async (values) => {
        setLoading(true)
        try {
            const requestData = {...values, institution: AuthenticationService.getUserTenantId()};
            const response = await TripService.create(requestData);

            if(response.status === 201) {
                message.success("Trip Created Successfully")
                refreshPage()
            }
        } catch (e) {
            handleJerryError(e)
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        form.resetFields();
    }

    return (
        <Modal
            title={"Add new trip"}
            open={open}
            onCancel={() => {
                handleClear();
                close()
            }}
            width={700}
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
                    rules={[{ required: true, message: 'Vehicle is required!' }]}
                    initialValue={vehicle?.id}
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Vehicle"
                        options={vehicles}
                        onChange={(value) => setFormVehicle(value)}
                    />
                </Form.Item>

                <Form.Item
                    name="millage_at_start"
                    label="Starting Millage"
                    rules={[{ required: true, message: 'Starting Millage is required!' }]}
                >
                    <InputNumber
                        size="large"
                        className="w-100"
                        placeholder="Starting Millage"
                    />
                </Form.Item>

                <Form.Item
                    name="driver"
                    label="Driver"
                    rules={[{ required: true, message: 'Driver is required!' }]}
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Driver"
                        options={drivers}
                    />
                </Form.Item>

                <Form.Item
                    name="start_date"
                    label="Start Time"
                    rules={[{ required: true, message: 'Starting Time is required!' }]}
                    getValueFromEvent={(e) => e?.format("YYYY-MM-DD HH:mm")}
                    getValueProps={(e) => ({
                        value: e ? dayjs(e) : "",
                    })}
                >
                    <DatePicker
                        showTime
                        className="w-100"
                        size="large"
                        format="YYYY-MM-DD HH:mm"
                        disabledDate={d => !d || d.isBefore(new Date())}
                    />
                </Form.Item>

                <Form.Item
                    name="destination"
                    label="Destination"
                    rules={[{ required: true, message: 'Destination is required!' }]}
                >
                    <Input
                        size="large"
                        placeholder="Name"
                    />
                </Form.Item>

                <Form.Item
                    name="trip_type"
                    label="Type"
                    rules={[{ required: true, message: 'Trip type is required!' }]}
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Type"
                        options={TRIP_PURPOSE.map((type) => (
                            {value: type, label: capitalize(type)}
                        ))}
                    />
                </Form.Item>

                <Form.Item
                    name="approved_by"
                    label="Approved By"
                    rules={[{ required: true, message: 'Field is required!' }]}
                >
                    <Select
                        allowClear
                        options={admins}
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        optionFilterProp="children"
                        filterSort={(optionA, optionB) =>
                            optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                        }
                        size="large"
                        className="w-100"
                        placeholder="Approved By"
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
                    Add new trip
                </Button>
            </Form>
        </Modal>
    )
}

export default NewTrip;