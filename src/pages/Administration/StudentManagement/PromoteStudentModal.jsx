import {Button, Form, Input, Modal, message, Select} from "antd";
import {useEffect, useState} from "react";
import authenticationService from "../../../services/authentication.service";
import { PlusOutlined } from "@ant-design/icons";
import {handleError, refreshPage} from "../../../common";
import StudentService from "../../../services/student.service";
import LevelService from "../../../services/level.service";

const PromoteStudentModal = ({ open, close, studentId, fullname}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [form] = Form.useForm();
    const [levels, setLevels] = useState([]);

    const fetchLevels = async () => {
        try {
            const response = await LevelService.getAll(authenticationService.getUserTenantId())

            if (response.status === 200) {
                const levels = response.data?.map((level) => ({
                    label: level?.name,
                    value: level?.id,
                }));
                setLevels(levels);
            }
        } catch (error) {
            console.error("Error occurred during fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, [open]);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            setDisabled(true);

            const data = {
                students: [studentId],
                level: values.level,
            };

            const response = await StudentService.promoteStudents(data);

            if (response.status === 200) {
                close();
                setLoading(false);
                setDisabled(false);
                message.success("Student's level has been upgraded successfully");
                refreshPage();
            } else {
                setLoading(false);
                setDisabled(false);
                message.error("An error occurred, please check your network.");
            }
        } catch (error) {
            setLoading(false);
            setDisabled(false);
            handleError(error);
        }
    };

    return (
        <>
            <Modal
                title="Upgrade Student Level"
                open={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                        label="Student Name"
                    >
                        <Input
                            size="large"
                            value={fullname}
                            style={{ backgroundColor: "grey" }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="level"
                        label="Level"
                        rules={[{ required: true, message: "Please enter a level" }]}
                    >
                        <Select
                            size="large"
                            options={levels}
                        />
                    </Form.Item>

                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={disabled}
                        icon={<PlusOutlined />}
                        block
                    >
                        Upgrage Student Level
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default PromoteStudentModal;
