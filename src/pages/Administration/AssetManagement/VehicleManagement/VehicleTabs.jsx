import {Button, Divider, Dropdown, Tabs} from "antd";
import VehiclesList from "./VehiclesList";
import {
    CarOutlined, CheckCircleOutlined,
    DollarOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import NewVehicle from "./NewVehicle";
import NewTrip from "./Trips/NewTrip";
import NewVehicleDamage from "./Damages/NewVehicleDamage";
import NewVehicleService from "./Services/NewVehicleService";
import {useState} from "react";
import AllTrips from "./Trips/AllTrips";
import AllServices from "./Services/AllServices";
import AllDamages from "./Damages/AllDamages";
import AllInsurances from "./Insurance/AllInsurances";
import NewVehicleInsurance from "./Insurance/NewVehicleInsurance";
import {useLoaderData} from "react-router-dom";
import AuthenticationService from "../../../../services/authentication.service";
import VehicleService from "../../../../services/vehicle.service";
import SchoolStatistics from "../../Dashboard/SchoolStatistics";

export const vehicleTabsLoader = async () => {
    try {
        const vehicleStatsResponse = await VehicleService.getVehicleStatsByInstitutionId(AuthenticationService.getUserTenantId());
        return {vehicleStats: vehicleStatsResponse.data}
    } catch (e) {
        return {vehicleStats: {}};
    }
}

const VehicleTabs = () => {
    const [newVehicleModal, setNewVehicleModal] = useState(false);
    const [newTripModal, setNewTripModal] = useState(false);
    const [newServiceModal, setNewServiceModal] = useState(false);
    const [newDamageModal, setNewDamageModal] = useState(false);
    const [newInsuranceModal, setNewInsuranceModal] = useState(false);

    const {vehicleStats} = useLoaderData();

    const tabItems = [
        {
            key: '1',
            label: "Vehicles",
            children: <VehiclesList />
        },
        {
            key: '2',
            label: "Trips",
            children: <AllTrips />
        },
        {
            key: '3',
            label: "Services",
            children: <AllServices />
        },
        {
            key: '4',
            label: "Damages",
            children: <AllDamages />
        },
        {
            key: '5',
            label: "Insurance",
            children: <AllInsurances />
        },
    ]

    const items = [
        {
            label: 'New Vehicle',
            key: '1',
            onClick: () => setNewVehicleModal(true)
        },
        {
            label: 'New Trip',
            key: '2',
            onClick: () => setNewTripModal(true)
        },
        {
            label: 'New Service',
            key: '3',
            onClick: () => setNewServiceModal(true)
        },
        {
            label: 'New Damage',
            key: '4',
            onClick: () => setNewDamageModal(true)
        },
        {
            label: 'New Insurance',
            key: '5',
            onClick: () => setNewInsuranceModal(true)
        },
    ]

    const menuProps = {
        items,
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Vehicle Data</h3>
                <div className="align-items-center">
                    <Dropdown menu={menuProps}>
                        <Button
                            type="primary"
                            icon={<DownOutlined />}
                        >
                            Actions
                        </Button>
                    </Dropdown>
                </div>
            </div>

            <div className="container-fluid p-0">
                <div className="row gy-3 mb-3">
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Vehicle Estimated price"
                            value={`USD ${vehicleStats?.total_vehicles_current_valuation}`}
                            icon={<DollarOutlined style={{fontSize: 40, color: "#518d18"}} />}
                        />
                    </div>
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Vehicles"
                            value={vehicleStats.total_vehicles}
                            icon={<CarOutlined style={{fontSize: 40, color: "#1b5dd9"}} />}
                        />
                    </div>
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Available Vehicles"
                            value={vehicleStats.total_available_vehicles}
                            icon={<CheckCircleOutlined style={{fontSize: 40, color: "#17e891"}} />}
                        />
                    </div>
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Damaged Vehicles"
                            value={vehicleStats?.total_damaged_vehicles}
                            icon={<ExclamationCircleOutlined style={{fontSize: 40, color: "#cc1b1b"}} />}
                        />
                    </div>
                </div>
            </div>

            <Divider type={"horizontal"} />

            <div className='container-fluid p-0'>
                <Tabs
                    defaultActiveKey="1"
                    items={tabItems}
                    style={{color: '#39b54a'}}
                />
            </div>

            <NewVehicle
                open={newVehicleModal}
                close={() => setNewVehicleModal(false)}
                vehicle={null}
            />

            <NewTrip
                open={newTripModal}
                close={() => setNewTripModal(false)}
            />

            <NewVehicleDamage
                open={newDamageModal}
                close={() => setNewDamageModal(false)}
            />

            <NewVehicleService
                open={newServiceModal}
                close={() => setNewServiceModal(false)}
            />

            <NewVehicleInsurance
                open={newInsuranceModal}
                close={() => setNewInsuranceModal(false)}
            />
        </>
    )
}

export default VehicleTabs;