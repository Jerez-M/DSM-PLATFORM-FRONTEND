import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select} from "antd";
import {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import VehicleService from "../../../../../services/vehicle.service";
import AuthenticationService from "../../../../../services/authentication.service";
import {capitalize, handleJerryError, refreshPage, dateTimeFormat} from "../../../../../common";
import TripService from "../../../../../services/trip.service";
import AdministratorService from "../../../../../services/administrator.service";
import TRIP_PURPOSE from "../../../../../utils/trip-purpose";
import dayjs from "dayjs";

const EditTrip = ({open, close, trip}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])
    const [admins, setAdmins] = useState([])

    const tenantId = AuthenticationService.getUserTenantId();

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
    }, [open]);

    useEffect(() => {
        if(trip) {
            form.setFieldsValue({
                "vehicle": trip.vehicle?.id,
                "millage_at_start": trip.millage_at_start,
                "millage_at_finish": trip.millage_at_finish,
                "driver": trip.driver?.id,
                "start_date": dayjs(trip.start_date, dateTimeFormat),
                "destination": trip.destination,
                "fuel_used": trip.fuel_used,
                "approved_by": trip.approved_by?.id,
                "trip_type": trip.trip_type,
                "notes": trip.notes,
            })

            if(trip.return_date) {
                form.setFieldsValue({"return_date": dayjs(trip.return_date, dateTimeFormat)})
            }
        }
    }, [open]);

    const handleFormSubmit = async (values) => {
        setLoading(true)
        try {
            const res = await TripService.update(trip?.id, values);
            if(res.status === 200) {
                message.success("Trip Updated successfully")
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
            title={trip ? "Edit trip" : "Add new trip"}
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
                    rules={[{ required: (trip === null), message: 'Vehicle is required!' }]}
                    initialValue={trip?.vehicle?.id}
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
                            name="millage_at_start"
                            label="Starting Millage"
                            rules={[{ required: (trip === null), message: 'Starting Millage is required!' }]}
                            initialValue={trip?.millage_at_start}
                        >
                            <InputNumber
                                size="large"
                                className="w-100"
                                placeholder="Starting Millage"
                                options={drivers}
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="millage_at_finish"
                            label="Ending Millage"
                            rules={[{ required: true, message: 'Ending Millage is required!' }]}
                            initialValue={trip?.millage_at_finish}
                        >
                            <InputNumber
                                size="large"
                                className="w-100"
                                placeholder="Ending Millage"
                                options={drivers}
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="driver"
                    label="Driver"
                    rules={[{ required: true, message: 'Driver is required!' }]}
                    initialValue={trip?.driver?.id}
                >
                    <Select
                        allowClear
                        size="large"
                        placeholder="Driver"
                        options={drivers}
                    />
                </Form.Item>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="start_date"
                            label="Start Time"
                        >
                            <DatePicker
                                showTime
                                className="w-100"
                                size="large"
                                format="YYYY-MM-DD HH:mm"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="return_date"
                            label="Return Time"
                            rules={[{ required: true, message: 'End date is required!' }]}
                        >
                            <DatePicker
                                showTime
                                className="w-100"
                                size="large"
                                format={dateTimeFormat}
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="destination"
                    label="Destination"
                    rules={[{ required: (trip === null), message: 'Destination is required!' }]}
                >
                    <Input
                        size="large"
                        placeholder="Name"
                    />
                </Form.Item>

                <div className="row">
                    <div className="col-6">
                        <Form.Item
                            name="fuel_used"
                            label="Fuel Used"
                        >
                            <InputNumber
                                size="large"
                                className="w-100"
                                placeholder="Fuel Used"
                                suffix="L"
                            />
                        </Form.Item>
                    </div>
                    <div className="col-6">
                        <Form.Item
                            name="approved_by"
                            label="Approved By"
                        >
                            <Select
                                allowClear
                                options={admins}
                                optionFilterProp="children"
                                filterSort={(optionA, optionB) =>
                                    optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
                                }
                                size="large"
                                className="w-100"
                                placeholder="Approved By"
                            />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name="trip_type"
                    label="Type"
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
                    name="notes"
                    label="Notes"
                    initialValue={trip?.notes}
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
                    {trip ? "Edit trip" : "Add new trip"}
                </Button>
            </Form>
        </Modal>
    )
}

export default EditTrip;