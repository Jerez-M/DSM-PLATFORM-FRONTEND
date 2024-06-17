/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Popconfirm, Space, Table, Tooltip, Divider, message, Alert } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import authenticationService from "../../../../../services/authentication.service";
import { useNavigate } from "react-router-dom";
import NewAssetCategory from "./NewAssetCategory";
import EditAssetCategory from "./EditAssetCategory";
import generalAssetsServices from "../../../../../services/general-assets.services";
import { deleteColor, editColor } from "../../../../../common";

const AssetCategoryList = () => {
    const [EditAssetCategoryModalState, setEditAssetCategoryModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [assetCategoryList, setAssetCategoryList] = useState([]);

    const navigate = useNavigate();

    const id = authenticationService.getUserTenantId();

    const [newAssetCategoryModalState, setNewAssetCategoryModalState] = useState(false);


    const fetchAssetCategories = async () => {
        try {
            const response = await generalAssetsServices.getAllAssetCategories(id);

            if (response?.status === 200) {
                setAssetCategoryList(response?.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching asset categories", error);
        }
    };

    useEffect(() => {
        fetchAssetCategories();
    }, []);

    const assetCategorysTableColumns = [
        {
            title: "Asset Category ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Asset Category name",
            dataIndex: "name",
            key: "name",
            render: (dataIndex) => (
                <strong>
                    {dataIndex}
                </strong>
            )
        },
        {
            title: "Action",
            dataIndex: "",
            key: "",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Asset Items">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                navigate(
                                    `/admin/general-assets/asset-items/${record.id}`
                                );
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Asset Category">
                        <Button
                            className="text-light border-0"
                            style={{ background: editColor }}
                            icon={<EditOutlined />}
                            onClick={() => editAssetCategory(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Asset Category">
                        <Popconfirm
                            title="Delete Asset Category"
                            description="Are you sure you want to delete this asset category?"
                            onConfirm={() => deleteAssetCategory(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                                style={{ color: deleteColor }}
                            />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const deleteAssetCategory = async (record) => {
        try {
            const response = await generalAssetsServices.deleteAssetCategory(record.id)

            if (response.status === 204) {
                message.info("Asset category deleted successifully")
                fetchAssetCategories()
            } else {
                message.error("Asset category could not be deleted")
            }
        } catch (error) {
            message.error("Asset category could not be deleted")
        }
    }

    const editAssetCategory = (record) => {
        setSelectedRecord(record)
        setEditAssetCategoryModalState(true)
    }


    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>General Assets Data</h3>

                <Button
                    className='border-0 px-3 text-white'
                    style={{ background: '#39b54a' }}
                    onClick={() => setNewAssetCategoryModalState(true)}
                >
                    <Space>
                        Add new asset category
                        <PlusCircleOutlined />
                    </Space>
                </Button>
            </div>
            <Divider type={"horizontal"} />

            <Space
                className="mb-3"
                direction="vertical"
                style={{
                width: '100%',
                }}
            >
                <Alert
                    message="Instructions"
                    description="First add the asset category for the assets you want to capture and then select the asset category you just created. Inside that asset category, add all the assets items which falls under that category."
                    type="info"
                    showIcon
                    closable
                />
            </Space>

            <Table dataSource={assetCategoryList} columns={assetCategorysTableColumns} />

            <NewAssetCategory open={newAssetCategoryModalState} close={() => setNewAssetCategoryModalState(false)} />
            <EditAssetCategory open={EditAssetCategoryModalState} close={() => setEditAssetCategoryModalState(false)} record={selectedRecord} />

        </>
    );
};

export default AssetCategoryList;
