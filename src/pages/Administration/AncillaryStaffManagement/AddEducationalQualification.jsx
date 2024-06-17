import {Form, Input, Modal, Select, DatePicker, Button, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import HumanResources from "../../../services/human-resources";
import {refreshPage} from "../../../common";

const {RangePicker} = DatePicker;

const AddEducationalQualification = ({isOpen, isClose, empId}) => {
    const [form] = Form.useForm();

    const [institution, setInstitution] = useState("");
    const [qualification, setQualification] = useState("");
    const [level, setLevel] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");

    const [isAddEducationalQualificationBtnDisabled, setIsAddEducationalQualificationBtnDisabled] = useState(false);

    const educationalQualificationsLevels = [
        {
            "value": "No Formal Education",
            "label": "No Formal Education"
        },
        {
            "value": "Primary Education",
            "label": "Primary Education"
        },
        {
            "value": "Secondary Education",
            "label": "Secondary Education"
        },
        {
            "value": "High School Diploma",
            "label": "High School Diploma"
        },
        {
            "value": "Vocational Training",
            "label": "Vocational Training"
        },
        {
            "value": "Associate's Degree",
            "label": "Associate's Degree"
        },
        {
            "value": "Bachelor's Degree",
            "label": "Bachelor's Degree"
        },
        {
            "value": "Master's Degree",
            "label": "Master's Degree"
        },
        {
            "value": "Doctorate (Ph.D.)",
            "label": "Doctorate (Ph.D.)"
        }
    ]

    const handleChangeEducationQualificationLevel = (value) => {
        setLevel(value);
    }

    const handleAddEducationalQualification = async () => {
        setIsAddEducationalQualificationBtnDisabled(true);

        try {
            const response = await HumanResources.createEducationalQualification({
                institution,
                qualification,
                level,
                start_date: startDate,
                end_date: endDate,
                description,
                employee: empId
            });

            if(response.status === 201) {
                isClose();
                form.resetFields();
                setIsAddEducationalQualificationBtnDisabled(false);
                message.success("Educational qualification added successfully");
                refreshPage();
            }
        } catch (e) {
            setIsAddEducationalQualificationBtnDisabled(false);
            message.error(e.response.data.error);
        }

    }

    return (
        <Modal
            open={isOpen}
            onCancel={isClose}
            destroyOnClose={true}
            maskClosable={true}
            okButtonProps={{
                className: 'd-none'
            }}
            cancelButtonProps={{
                className: 'd-none'
            }}
            centered
        >
            <div>
                <h3>Add educational qualification</h3>
            </div>

            <Form
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label='Qualification name'
                    name='qualification'
                    rules={[
                        {
                            required: true,
                            message: 'Please input qualification',
                        },
                    ]}
                >
                    <Input
                        name='qualification'
                        placeholder='Enter qualification name'
                        size={"large"}
                        onChange={(e) => setQualification(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label='Level'
                    name='level'
                >
                    <Select
                        name='level'
                        size={"large"}
                        placeholder='Select level'
                        options={educationalQualificationsLevels}
                        onChange={handleChangeEducationQualificationLevel}
                    />
                </Form.Item>

                <Form.Item
                    label='Institution'
                    name='institution'
                    rules={[
                        {
                            required: true,
                            message: 'Please input institution',
                        },
                    ]}
                >
                    <Input
                        name='institution'
                        placeholder='Enter institution'
                        size={"large"}
                        onChange={(e) => setInstitution(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    label='Dates'
                    name='dates'
                >
                    <RangePicker
                        name='dates'
                        size={"large"}
                        placeholder={['Start date', 'End date']}
                        className={"w-100"}
                        onChange={(value, dateString) => {
                            setStartDate(dateString[0]);
                            setEndDate(dateString[1]);
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label='Description'
                    name='description'
                >
                    <Input.TextArea
                        name='description'
                        placeholder='Enter description'
                        size={"large"}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Item>

                <Button
                    type='primary'
                    size={"large"}
                    className='w-100'
                    icon={<PlusOutlined />}
                    disabled={isAddEducationalQualificationBtnDisabled}
                    onClick={handleAddEducationalQualification}
                >
                    Add
                </Button>
            </Form>
        </Modal>
     );
}

export default AddEducationalQualification;