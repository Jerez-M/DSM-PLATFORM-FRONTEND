import {
    ArrowLeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EditOutlined,
} from "@ant-design/icons";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Button, Card, Divider, Tag, Typography} from "antd";
import {useState} from "react";
import {toHumanDate} from "../../../../common";
import ElectronicsService from "../../../../services/electronics.service";
import NewElectronicGadget from "./NewElectronicGadget";

export const electronicGadgetLoader = async ({params}) => {
    try {
        const deviceResponse = await ElectronicsService.getById(params.id)
        return {gadget: deviceResponse.data}
    } catch (e) {
        console.log(e)
        return null
    }
}

const ElectronicGadgetPage = () => {
    const [editGadgetModal, setEditGadgetModal] = useState(false);

    const navigate = useNavigate();
    const {gadget} = useLoaderData();

    return (
        <>
            <div className="px-4 h-100">
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
                    <h1>Electronic Gadget Page</h1>
                    <Button
                        type="primary"
                        onClick={() => setEditGadgetModal(true)}
                        icon={<EditOutlined/>}
                    >
                        Edit Electronic Gadget
                    </Button>
                </div>

                <Divider/>

                <Card className="row mb-5 w-75 w-l-50 mx-auto">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3>{gadget?.name}</h3>
                        <Tag
                            icon={gadget?.status === "WORKING" ? <CheckCircleOutlined/> : <CloseCircleOutlined/>}
                            color={gadget?.status === "WORKING" ? "green" : "red"}
                        >
                            {gadget?.status}
                        </Tag>
                    </div>
                    <div className="d-flex">
                        <div className="ml-4">
                            <h4>{gadget?.manufacturer} {gadget?.model} <span className="text-muted" >: {gadget?.model_number}</span></h4>
                            <Typography.Title level={5} type="success">{gadget?.serial_number}</Typography.Title>
                            <p>{gadget?.description}</p>
                            <strong>{gadget?.type?.name}</strong>
                        </div>
                    </div>

                    <div className="section mt-5">
                        <h4 className="mb-3">Details</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <p className="table-row">
                                    <span>Purchase Price:</span>
                                    <strong>{gadget?.currency} {gadget?.purchase_price}</strong>
                                </p>
                                <p className="table-row">
                                    <span>Salvage Price:</span>
                                    <strong>{gadget?.currency} {gadget?.salvage_price}</strong>
                                </p>
                                <p className="table-row">
                                    <span>Purchase Date:</span>
                                    <strong>{toHumanDate(gadget?.purchase_date)}</strong>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="table-row">
                                    <span>Depreciation Rate:</span>
                                    <strong>{gadget?.depreciation_rate}%</strong>
                                </p>
                                <p className="table-row">
                                    <span>Estimated Current Price:</span>
                                    <strong>{gadget?.currency} {gadget?.estimated_system}</strong>
                                </p>
                                <p className="table-row">
                                    <span>Warranty Expiration Date:</span>
                                    <strong>{toHumanDate(gadget?.warranty_expiration_date)}</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {gadget?.supplier?.id && (
                        <div className="section mt-5">
                            <h5>Supplier Details</h5>
                            <p>
                                Name: <strong>{gadget?.supplier?.supplier_name}</strong> {" "}
                                Contact: <strong>{gadget?.supplier?.contact}</strong> {" "}
                                Email: <strong>{gadget?.supplier?.email}</strong> {" "}
                                Address: <strong>{gadget?.supplier?.address}</strong>
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            <NewElectronicGadget
                open={editGadgetModal}
                close={() => setEditGadgetModal(false)}
                gadget={gadget}
            />
        </>
    );
}

export default ElectronicGadgetPage;