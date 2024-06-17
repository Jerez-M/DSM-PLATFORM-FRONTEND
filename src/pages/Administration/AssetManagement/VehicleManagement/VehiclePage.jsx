import VehicleService from "../../../../services/vehicle.service";
import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined, DeleteOutlined,
    EditOutlined, EyeOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Button, Divider, Popconfirm, Space, Table, Tag, Tooltip, Typography} from "antd";
import bus from "../../../../Assets/images/vehicles/bus.svg";
import car from "../../../../Assets/images/vehicles/car.svg";
import truck from "../../../../Assets/images/vehicles/truck.svg";
import tractor from "../../../../Assets/images/vehicles/tractor.svg";
import carOther from "../../../../Assets/images/vehicles/car-other.svg";
import {useState} from "react";
import NewVehicle from "./NewVehicle";
import {deleteColor, editColor, toHumanDate, toHumanDateTime, toYear} from "../../../../common";
import NewTrip from "./Trips/NewTrip";
import NewVehicleDamage from "./Damages/NewVehicleDamage";
import NewVehicleService from "./Services/NewVehicleService";
import TripService from "../../../../services/trip.service";
import VehicleDamageService from "../../../../services/vehicle-damage.service";
import VehicleServiceService from "../../../../services/vehicle-service.service";
import EditTrip from "./Trips/EditTrip";
import VehicleInsuranceService from "../../../../services/vehicle-insurance.service";
import NewVehicleInsurance from "./Insurance/NewVehicleInsurance";

export const vehiclePageLoader = async ({params}) => {
    const vehicleId = params.id
    try {
        const vehicleResponse = await VehicleService.getVehicleById(vehicleId)
        const tripsResponse = await TripService.getTripsByVehicleId(vehicleId)
        const damagesResponse = await VehicleDamageService.getDamagesByVehicleId(vehicleId)
        const servicesResponse = await VehicleServiceService.getServicesByVehicleId(vehicleId)
        const insurancesResponse = await VehicleInsuranceService.getInsurancesByVehicleId(vehicleId)

        return {
            vehicle: vehicleResponse.data,
            trips: tripsResponse.data,
            damages: damagesResponse.data,
            services: servicesResponse.data,
            insurances: insurancesResponse.data,
        }
    } catch (e) {
        console.log(e)
        return {
            vehicle: {}
        }
    }
}

const VehiclePage = () => {
    const [editVehicleModal, setEditVehicleModal] = useState(false);
    const [newTripModal, setNewTripModal] = useState(false);
    const [editTripModal, setEditTripModal] = useState(false);
    const [newDamageModal, setNewDamageModal] = useState(false);
    const [newVehicleService, setNewVehicleService] = useState(false)
    const [newVehicleInsurance, setNewVehicleInsurance] = useState(false)

    const [selectedDamage, setSelectedDamage] = useState(null)
    const [selectedVehicleService, setSelectedVehicleService] = useState(null)
    const [selectedVehicleInsurance, setSelectedVehicleInsurance] = useState(null)
    const [selectedTrip, setSelectedTrip] = useState(null)

    const navigate = useNavigate();
    const {vehicle, trips, damages, services, insurances} = useLoaderData();

    const getSrc = () => {
        let src;
        switch (vehicle?.type) {
            case "BUS":
                src = bus;
                break;
            case "CAR":
                src = car;
                break;
            case "TRUCK":
                src = truck;
                break;
            case "TRACTOR":
                src = tractor;
                break;
            default:
                src = carOther;
        }
        return src
    }

    const editDamage = (damage) => {
        setSelectedDamage(damage)
        setNewDamageModal(true)
    }

    const editService = (service) => {
        setSelectedVehicleService(service)
        setNewVehicleService(true)
    }

    const editInsurance = (insurance) => {
        setSelectedVehicleInsurance(insurance)
        setNewVehicleService(true)
    }

    const editTrip = (trip) => {
        setSelectedTrip(trip)
        setEditTripModal(true)
    }

    const tripTableColumns = [
        {
            title: "Destination",
            dataIndex: "destination",
            key: "destination"
        },
        {
            title: "Return Date",
            key: "return_date",
            render: (record) => `${toHumanDateTime(record?.return_date)}`
        },
        {
            title: "Type",
            dataIndex: "trip_type",
            key: "trip_type"
        },
        {
            title: "Driver",
            key: "driver",
            responsive: ['xxl'],
            render: (record) => `${record?.driver?.firstName} ${record?.driver?.lastName}`
        },
        {
            title: "Distance traveled (Km)",
            key: "distance",
            responsive: ['xxl'],
            render: (record) => `${record?.millageAtStart - record?.millageAtFinish}`
        },
        {
            title: "Fuel Used (L)",
            dataIndex: "fuel_used",
            responsive: ['xxl'],
            key: "fuel_used",
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Trip">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            // onClick={() => {
                            //     navigate(
                            //         `/admin/trip/${record?.id}/`
                            //     );
                            // }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Trip">
                        <Button
                            type="primary"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editTrip(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Trip">
                        <Popconfirm
                            title="Delete Trip"
                            description="Are you sure you want to delete this trip?"
                            // onConfirm={() => deleteTrip(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                style={{ color: deleteColor }}
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            )
        }
    ]

    const damageTableColumns = [
        {
            title: "Severity",
            dataIndex: "damage_severity",
            key: "damage_severity"
        },
        {
            title: "Date",
            key: "damage_date",
            render: (record) => `${toHumanDate(record?.damage_date)}`
        },
        {
            title: "Repair Status",
            dataIndex: "repair_status",
            key: "repair_status"
        },
        {
            title: "description",
            dataIndex: "description",
            key: "description",
            responsive: ['xxl'],
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Damage">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            // onClick={() => {
                            //     navigate(
                            //         `/admin/damage/${record.id}/`
                            //     );
                            // }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Damage">
                        <Button
                            type="primary"
                            style={{backgroundColor: editColor}}
                            icon={<EditOutlined />}
                            onClick={() => editDamage(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const serviceTableColumns = [
        {
            title: "Service Type",
            dataIndex: "service_type",
            key: "serviceType"
        },
        {
            title: "Date",
            key: "dateOfService",
            render: (record) => `${toHumanDate(record.date_of_service)}`
        },
        {
            title: "Cost",
            key: "cost",
            render: (record) => record.currency + record.cost
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
            responsive: ['xxl'],
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Service">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            // onClick={() => {
                            //     navigate(
                            //         `/admin/damage/${record.id}/`
                            //     );
                            // }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Service">
                        <Button
                            type="primary"
                            style={{backgroundColor: editColor}}
                            icon={<EditOutlined />}
                            onClick={() => editService(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    const insuranceTableColumns = [
        {
            title: "Purchased Date",
            key: "purchased_date",
            render: (record) => `${toHumanDate(record?.purchased_date)}`
        },
        {
            title: "Expiry Date",
            key: "expiry_date",
            render: (record) => `${toHumanDate(record?.expiry_date)}`
        },
        {
            title: "Cost",
            key: "estimated_insurance_cost",
            render: (record) => record.currency + record.amount,
        },
        {
            title: "Description",
            key: "description",
            render: (record) => (
                <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: "more"}} className="mt-2">
                    {record.description}
                </Typography.Paragraph>
            ),
            responsive: ["xl"],
        },
        {
            title: "Actions",
            key: "actions",
            render: (record) => (
                <Space size="middle">
                    <Tooltip title="View Trip">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                navigate(
                                    `/admin/insurance/${record.id}/`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Insurance">
                        <Button
                            type="primary"
                            style={{backgroundColor: editColor}}
                            icon={<EditOutlined />}
                            onClick={() => editInsurance(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ]

    return (
        <>
            <div className="h-100">
                <Link to={'..'}
                      onClick={(e) => {
                          e.preventDefault();
                          navigate(-1);
                      }}
                      className='text-muted text-decoration-none mb-2'
                >
                    <ArrowLeftOutlined/> Back
                </Link>
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Vehicle Page</h1>
                    <Button
                        type="primary"
                        onClick={() => setEditVehicleModal(true)}
                        icon={<EditOutlined/>}
                    >
                        Edit Vehicle
                    </Button>
                </div>

                <Divider/>

                <div className="row mb-5">
                    <div className="col-lg-7 px-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3>{vehicle?.name}</h3>
                            <Tag
                                icon={vehicle?.availability === "AVAILABLE" ? <CheckCircleOutlined/> :
                                    <CloseCircleOutlined/>}
                                color={vehicle?.availability === "AVAILABLE" ? "green" : "red"}
                            >
                                {vehicle?.availability}
                            </Tag>
                        </div>
                        <div className="d-flex">
                            <img src={getSrc()} alt={vehicle?.name} style={{width: "40%"}}/>
                            <div className="ml-4">
                                <h4>{vehicle?.manufacturer} {vehicle?.model}</h4>
                                <Typography.Title level={5} type="success">{vehicle?.numberplate}</Typography.Title>
                                <p>{vehicle?.description}</p>
                                <strong>{vehicle?.type}</strong>
                            </div>
                        </div>

                        <div className="section mt-5">
                            <h4 className="mb-3">Financial</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="table-row"><span>Purchase Price:</span>
                                        <strong>{vehicle?.currency} {vehicle?.purchase_price}</strong></p>
                                    <p className="table-row"><span>Depreciation Rate:</span>
                                        <strong>{vehicle?.depreciation}</strong></p>
                                    <p className="table-row"><span>Purchase Date:</span>
                                        <strong>{toHumanDate(vehicle?.purchased_date)}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className="table-row"><span>User estimated current valuation:</span>
                                        <strong>{vehicle?.currency}{vehicle?.user_estimated_latest_valuation}</strong>
                                    </p>
                                    <p className="table-row"><span>System Estimated Current valuation:</span>
                                        <strong>{vehicle?.system_estimated_latest_valuation}</strong></p>
                                    <p className="table-row"><span>Purchase Millage:</span>
                                        <strong>{vehicle?.purchase_millage}</strong></p>
                                </div>
                            </div>
                        </div>


                        <div className="section mt-5">
                            <h4 className="mb-3">Operation Information</h4>
                            <div className="row gx-4">
                                <div className="col-md-6">
                                    <p className="table-row"><span>Net Weight:</span>
                                        <strong>{vehicle?.net_weight}</strong></p>
                                    <p className="table-row"><span>Fuel Capacity:</span>
                                        <strong>{vehicle?.fuel_capacity}</strong></p>
                                    <p className="table-row"><span>Seating Capacity:</span>
                                        <strong>{vehicle?.number_of_seats}</strong></p>
                                    <p className="table-row"><span>Transmission:</span>
                                        <strong>{vehicle?.transmission}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className="table-row"><span>Carry Weight:</span>
                                        <strong>{vehicle?.carry_weight}</strong></p>
                                    <p className="table-row"><span>Fuel Type:</span>
                                        <strong>{vehicle?.fuel_type}</strong></p>
                                    <p className="table-row"><span>Drive:</span> <strong>{vehicle?.drive}</strong></p>
                                    <p className="table-row"><span>Current Millage:</span>
                                        <strong>{vehicle?.current_millage}</strong></p>
                                </div>
                            </div>
                        </div>

                        <div className="section mt-5">
                            <h4 className="mb-3">Key information</h4>
                            <div className="row gx-4">
                                <div className="col-md-6">
                                    <p className="table-row"><span>Registration Number:</span>
                                        <strong>{vehicle?.registration_number}</strong></p>
                                    <p className="table-row"><span>Chassis Number:</span>
                                        <strong>{vehicle?.chassis_number}</strong></p>
                                    <p className="table-row"><span>Engine Number:</span>
                                        <strong>{vehicle?.engine_number}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className="table-row"><span>Production Year:</span>
                                        <strong>{toYear(vehicle?.production_year)}</strong></p>
                                    <p className="table-row"><span>Vin:</span>
                                        <strong>{vehicle?.vin}</strong></p>
                                    <p className="table-row"><span>Engine Size:</span>
                                        <strong>{vehicle?.engine_size} CC</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5 p-3" style={{background: "#e3e1df"}}>
                        <div className="mb-3">
                            <h5>
                                Vehicle Trips
                                <Button
                                    type="text"
                                    icon={<PlusCircleOutlined/>}
                                    onClick={() => setNewTripModal(true)}
                                />
                            </h5>
                            <Table columns={tripTableColumns} dataSource={trips} rowKey="id" />
                        </div>

                        <div className="mb-3">
                            <h5>
                                Vehicle Damages
                                <Button
                                    type="text"
                                    icon={<PlusCircleOutlined/>}
                                    onClick={() => setNewDamageModal(true)}
                                />
                            </h5>
                            <Table columns={damageTableColumns} dataSource={damages} rowKey="id" />
                        </div>

                        <div className="mb-3">
                            <h5>
                                Vehicle Services
                                <Button
                                    type="text"
                                    icon={<PlusCircleOutlined/>}
                                    onClick={() => setNewVehicleService(true)}
                                />
                            </h5>
                            <Table columns={serviceTableColumns} dataSource={services} rowKey="id" />
                        </div>

                        <div className="mb-3">
                            <h5>
                                Vehicle Insurances
                                <Button
                                    type="text"
                                    icon={<PlusCircleOutlined/>}
                                    onClick={() => setNewVehicleInsurance(true)}
                                />
                            </h5>
                            <Table columns={insuranceTableColumns} dataSource={insurances} rowKey="id" />
                        </div>
                    </div>
                </div>
            </div>

            <NewVehicle
                open={editVehicleModal}
                close={() => setEditVehicleModal(false)}
                vehicle={vehicle}
            />

            <NewTrip
                open={newTripModal}
                close={() => setNewTripModal(false)}
                vehicle={vehicle}
            />

            <EditTrip
                open={editTripModal}
                close={() => setEditTripModal(false)}
                trip={selectedTrip}
            />

            <NewVehicleDamage
                open={newDamageModal}
                close={() => setNewDamageModal(false)}
                vehicleId={vehicle.id}
                vehicleDamage={selectedDamage}
            />

            <NewVehicleService
                open={newVehicleService}
                close={() => setNewVehicleService(false)}
                vehicleId={vehicle.id}
                vehicleService={selectedVehicleService}
            />

            <NewVehicleInsurance
                open={newVehicleInsurance}
                close={() => setNewVehicleInsurance(false)}
                vehicleId={vehicle.id}
                vehicleService={selectedVehicleInsurance}
            />
        </>
    );
}

export default VehiclePage;