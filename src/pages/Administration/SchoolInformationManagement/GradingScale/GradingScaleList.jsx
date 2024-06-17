import {Button, Card, Empty, message, Popconfirm, Space, Table, Tabs, Tooltip} from "antd";
import { useState, useEffect } from "react";
import {
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import authenticationService from "../../../../services/authentication.service";
import NewGradingScaleList from "./NewGradingScale";
import GradeScaleService from "../../../../services/grade-scale.service";
import {deleteColor, editColor, handleError, refreshPage} from "../../../../common";
import EditGradingScale from "./EditGradingScale";


const GradingScaleList = () => {
    const [newGradingScaleState, setNewGradingScaleState] = useState(false)
    const [updateGradingScale, setUpdateGradingScale] = useState(false)
    const [selectedGradeScale, setSelectedGradeScale] = useState(null)
    const [gradeScalesPerLevel, setGradeScalesPerLevel] = useState([])

    const tenantId = authenticationService.getUserTenantId();

    const fetchGradeScales = async () => {
        try {
            const response = await GradeScaleService.getAll(tenantId)

            if(response.data) {
                let gradeScalesGrouped = []

                response.data?.map(grade => {
                    let gradeScale = gradeScalesGrouped.find(gradesGrouped => (
                        gradesGrouped.level?.id === grade.level.id
                    ))

                    if(gradeScale) {
                        gradeScale.grades.push({
                            id: grade.id,
                            symbol: grade.symbol,
                            upperLimit: grade.upperLimit,
                            lowerLimit: grade.lowerLimit,
                            level: grade.level
                        })
                    } else {
                        gradeScalesGrouped.push({
                            level: grade.level,
                            grades: [{
                                id: grade.id,
                                symbol: grade.symbol,
                                upperLimit: grade.upperLimit,
                                lowerLimit: grade.lowerLimit,
                                level: grade.level
                            }]
                        })
                    }
                })
                    ?.sort((a, b) => {
                        if (a.level.name > b.level.name) return 1
                    })

                setGradeScalesPerLevel(gradeScalesGrouped)
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occured during fetching subjects:", error);
        }
    };

    useEffect(() => {
        fetchGradeScales();
    }, []);

    const editGradeScale = (subject) => {
        setSelectedGradeScale(subject)
        setUpdateGradingScale(true)
    }

    const deleteGradeScale = async (id) => {
        try {
            const response = await GradeScaleService.delete(id)

            if (response.status === 204) {
                message.success("Grade Scale deleted successfully")
                refreshPage()
            } else {
                message.error(response?.data?.error ?? "An error occurred, please check your network.");
            }
        } catch (e) {
            console.log({e})
            handleError(e)
        }
    }

    const modalClose = () => {
        setSelectedGradeScale(null)
        setNewGradingScaleState(false)
        setUpdateGradingScale(false)
    }

    const gradeScaleTableColumns = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol'
        },
        {
            title: 'Upper Limit',
            dataIndex: ['upperLimit'],
            key: 'upperLimit'
        },
        {
            title: 'Lower Limit',
            dataIndex: ['lowerLimit'],
            key: 'lowerLimit'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: '',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Edit Grade Scale">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            style={{background: editColor}}
                            onClick={() => editGradeScale(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Grade Scale">
                        <Popconfirm
                            title="Delete Grade Scale"
                            description="Are you sure you want to delete this grade scale?"
                            onConfirm={() => deleteGradeScale(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{color: deleteColor}} type="danger" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        }
    ]

    console.clear()
    return (
        <>
            {(gradeScalesPerLevel?.length > 0) && (
                <Tabs
                    tabPosition="left"
                    items={gradeScalesPerLevel?.map((gradeScaleList, i) => {
                        const id = String(i + 1);
                        return {
                            label: `${gradeScaleList.level?.name}`,
                            key: id,
                            children: <Table dataSource={gradeScaleList.grades} columns={gradeScaleTableColumns} />,
                        };
                    })}
                />
            )}

            {(gradeScalesPerLevel?.length < 1) && (
                <Card
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "70vh"}}
                >
                    <Empty />
                </Card>
            )}

            <NewGradingScaleList
                open={newGradingScaleState}
                close={modalClose}
            />

            <EditGradingScale
                open={updateGradingScale}
                close={modalClose}
                gradingScale={selectedGradeScale}
            />
        </>
    )
}

export default GradingScaleList;