import { Button, Divider, Form, Input, Modal, Popconfirm, Space, Table, Tooltip } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import SMSservice from "../../../../services/SMSservice";
import TextArea from "antd/es/input/TextArea";
import {toHumanDateTime, toTimeAgo} from "../../../../common";

const ListTeachersSms = () => {
    const [smsList, setSmsList] = useState([]);
    const [viewSmsModalState, setViewSmsModalState] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const userType = "TEACHER";

    const fetchSms = async () => {
        try {
            const response = await SMSservice.getByUserType(userType);

            if (response.status === 200) {
                setSmsList(response.data);
            } else {
                console.log("Request was not successful. Status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during fetching sms:", error);
        }
    };

    useEffect(() => {
        fetchSms();
    }, []);

    const smsListTableColumns = [
        {
            title: "Audience",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Date Send",
            dataIndex: "created",
            key: "created",
            render: (created) => {
                return toHumanDateTime(created)
            }
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
        },
        {
            title: "Action",
            dataIndex: "",
            key: "",
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View SMS">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => view(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete SMS">
                        <Popconfirm
                            title="Delete SMS"
                            description="Cannot delete SMS?"
                            okText="OK"
                            cancelText="Cancel"
                        >
                            <Button type="danger" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const view = (record) => {
        setSelectedRecord(record);
        setViewSmsModalState(true);
    };

    const closeModal = () => {
        setViewSmsModalState(false);
    };

    return (
        <>
            <Table className="table-responsive" dataSource={smsList} columns={smsListTableColumns} />

            <Modal
                title="View SMS Details"
                visible={viewSmsModalState}
                onCancel={closeModal}
                footer={null}
            >
                {selectedRecord && (
                    <>
                        <Form layout="vertical">
                        <Form.Item
                                label="Sender"
                            >
                                <Input
                                    size="large"
                                    defaultValue={selectedRecord?.author?.firstName + " " + selectedRecord?.author?.lastName}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Audience"
                            >
                                <Input
                                    size="large"
                                    defaultValue={selectedRecord?.role}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Date Send"
                            >
                                <Input
                                    size="large"
                                    defaultValue={selectedRecord?.created}
                                />
                            </Form.Item>

                            <Form.Item label="Message">
                                <TextArea style={{ height: "200px" }} defaultValue={selectedRecord?.message} />
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Modal>
        </>
    );
};

export default ListTeachersSms;