import {Button, Divider, Dropdown, Tabs} from "antd";
import {
    CheckCircleOutlined,
    DollarOutlined,
    DownOutlined,
    ExclamationCircleOutlined, ShoppingCartOutlined
} from "@ant-design/icons";
import {useState} from "react";
import NewElectronicGadget from "./NewElectronicGadget";
import ElectronicsList from "./ElectronicsList";
import {primaryColor} from "../../../../common";
import NewElectronicSupplier from "./Supplier/NewElectronicSupplier";
import ElectronicsSuppliersList from "./Supplier/ElectronicsSuppliersList";
import ElectronicsCategoriesList from "./Category/ElectronicsCategoriesList";
import NewElectronicCategory from "./Category/NewElectronicCategory";
import AuthenticationService from "../../../../services/authentication.service";
import ElectronicsService from "../../../../services/electronics.service";
import {useLoaderData} from "react-router-dom";
import SchoolStatistics from "../../Dashboard/SchoolStatistics";

export const electronicsTabsLoader = async () => {
    try {
        const statsResponse = await ElectronicsService.getStatsByInstitutionId(AuthenticationService.getUserTenantId());
        console.log("ststa:", statsResponse.data)
        return {electronicsStats: statsResponse.data}
    } catch (e) {
        return {electronicsStats: {}};
    }
}

const ElectronicsTabs = () => {
    const [newElectronic, setNewElectronic] = useState(false);
    const [newElectronicSupplier, setNewElectronicSupplier] = useState(false);
    const [newElectronicCategory, setNewElectronicCategory] = useState(false);

    const {electronicsStats} = useLoaderData();
    console.log(electronicsStats)

    const tabItems = [
        {
            key: '1',
            label: "Electronic Gadgets",
            children: <ElectronicsList />
        },
        {
            key: '2',
            label: "Electronic Category",
            children: <ElectronicsCategoriesList />
        },
        {
            key: '3',
            label: "Electronic Suppliers",
            children: <ElectronicsSuppliersList />
        },
    ]

    const items = [
        {
            label: 'New Electronic Gadget',
            key: '1',
            onClick: () => setNewElectronic(true)
        },
        {
            label: 'New Electronic Category',
            key: '2',
            onClick: () => setNewElectronicCategory(true)
        },
        {
            label: 'New Electronic Supplier',
            key: '3',
            onClick: () => setNewElectronicSupplier(true)
        },
    ]

    const menuProps = {
        items,
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Electronics Data</h3>
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
                            name="Total Electronics Estimated price"
                            value={`USD ${electronicsStats?.estimated_total_net_book_value}`}
                            icon={<DollarOutlined style={{fontSize: 40, color: "#518d18"}} />}
                        />
                    </div>
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Electronics"
                            value={electronicsStats.total}
                            icon={<ShoppingCartOutlined style={{fontSize: 40, color: "#1b5dd9"}} />}
                        />
                    </div>
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Available Electronics"
                            value={electronicsStats.total_available}
                            icon={<CheckCircleOutlined style={{fontSize: 40, color: "#17e891"}} />}
                        />
                    </div>
                    <div className="col-md-3">
                        <SchoolStatistics
                            name="Total Damaged Electronics"
                            value={electronicsStats?.total_damaged}
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
                    style={{color: primaryColor}}
                />
            </div>

            <NewElectronicGadget
                open={newElectronic}
                close={() => setNewElectronic(false)}
                gadget={null}
            />

            <NewElectronicSupplier
                open={newElectronicSupplier}
                close={() => setNewElectronicSupplier(false)}
                supplier={null}
            />

            <NewElectronicCategory
                open={newElectronicCategory}
                close={() => setNewElectronicCategory(false)}
                category={null}
            />
        </>
    )
}

export default ElectronicsTabs;