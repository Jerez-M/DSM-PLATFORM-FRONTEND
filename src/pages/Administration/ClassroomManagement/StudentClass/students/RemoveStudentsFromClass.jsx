import {Button, Form, Modal, Select, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import StudentClassService from "../../../../../services/student-class.service";
import {capitalize, handleError, refreshPage} from "../../../../../common";

const RemoveStudentsFromClass = ({open, close, classDetails, selectedAcademicYear, students, level}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleFormSubmit = async () => {
        setLoading(true);
        setDisabled(true)
        try {
            const response = await StudentClassService.removeStudentFromClass(selectedStudents, +classDetails.classId);
            if (response.status === 204) {
                message.success("Students Removed Successfully");
                refreshPage()
            }
        } catch (error) {
            handleError(error)
            setDisabled(false)
        } finally {
            setDisabled(false)
            setLoading(false);
            close();
        }
    };

    const _students = students?.map(student => ({
        value: student.id,
        label: `${student.firstname} ${student.lastname} (${student.registrationNumber})`
    }))

    return (
        <>
            <Modal
                title={`Remove Student from ${capitalize(level?.name)} ${classDetails.className}`}
                open={open}
                onCancel={close}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form
                    layout="vertical"
                    onFinish={() => handleFormSubmit()}
                >
                    <Form.Item
                        label={`${capitalize(level?.name)} ${classDetails?.className} Students of ${selectedAcademicYear?.name}`}
                        rules={[{ required: true, message: 'At least one student is required!' }]}
                        help={`If Student is not in the ${selectedAcademicYear?.name} year go back and switch to the correct year`}
                        className="my-4"
                    >
                        <Select
                            mode="single"
                            allowClear
                            placeholder="Select Student to remove from the class"
                            size="large"
                            onChange={setSelectedStudents}
                            options={_students}
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input) ||
                                (option?.label ?? '').toLowerCase().includes(input)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                        />
                    </Form.Item>
                    <Button
                        icon={<PlusOutlined/>}
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        block
                        htmlType="submit"
                        className="mt-4"
                    >
                        Remove student from class
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default RemoveStudentsFromClass;
