import {
    Button,
    Checkbox,
    Form,
    Input,
    Modal,
    Select,
    message,
} from "antd";
import {useState} from "react";
import authenticationService from "../../../services/authentication.service";
import parentService from "../../../services/parent.service";
import {PlusOutlined} from "@ant-design/icons";
import {capitaliseFirstLetters, handleError, phoneNumberPrefix, refreshPage, toInputUppercase} from "../../../common";

const NewParent = ({open, close, params}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        middleNames: "",
        role: "PARENT",
        gender: "",
        email: "",
        employer_address: "",
        password: "PASSWORD",
        parentType: "",
        address: "",
        nationalId: "",
        occupation: "",
        monthlyIncome: 0,
        singleParent: "FALSE",
        inActive: "TRUE",
    });

    const tenant = authenticationService.getUserTenantId();

    const [form] = Form.useForm();
    const currentURL = window.location.href;
    const urlParts = currentURL.split("/");
    const getStudents = urlParts[urlParts.length - 1];
    const students = [parseInt(getStudents)];

    const handleFormChange = (fieldName, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };

    const handleFormSubmit = async (values) => {
        let phoneNumber
        if (values.phoneNumber) phoneNumber = values.countryCode + values.phoneNumber;

        try {
            setLoading(true);
            setDisabled(true);

            const {
                firstName,
                lastName,
                middleNames,
                role,
                gender,
                email,
                employer_address,
                password,
                parentType,
                address,
                occupation,
                monthlyIncome,
                singleParent,
                inActive,
                nationalId
            } = formData;

            const data = {
                user: {
                    firstName: capitaliseFirstLetters(firstName),
                    lastName: capitaliseFirstLetters(lastName),
                    middleNames: capitaliseFirstLetters(middleNames),
                    role,
                    gender,
                    email,
                    phoneNumber,
                    password,
                    tenant,
                },
                address,
                parentType,
                employer_address,
                occupation: capitaliseFirstLetters(occupation),
                monthlyIncome,
                singleParent,
                inActive,
                students,
                nationalId,
            };

            const response = await parentService.create(data);

            if (response.status === 201) {
                close();
                setLoading(false);
                setDisabled(false);
                message.success("Parent Added Successfully");
                refreshPage();
            } else {
                message.error("Error adding parent");
                setLoading(false);
                setDisabled(false);
            }
        } catch (e) {
            message.error(e.response.data.error)
            setLoading(false);
            setDisabled(false);
            handleError(e)
        }
    };
    console.clear();
    return (
        <>
            <Modal
                title="Add Parent"
                open={open}
                onCancel={close}
                width={800}
                okButtonProps={{
                    className: "d-none",
                }}
                cancelButtonProps={{
                    className: "d-none",
                }}
            >
                <Form layout="vertical" form={form} onFinish={handleFormSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <Form.Item
                                name="firstName"
                                label="First name"
                                rules={[{required: true, message: 'First name is required!'}]}
                            >
                                <Input
                                    placeholder="First Name"
                                    size="large"
                                    onChange={(e) =>
                                        handleFormChange("firstName", e.target.value)
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="Middle name">
                                <Input
                                    placeholder="Middlename"
                                    size="large"
                                    onChange={(e) =>
                                        handleFormChange("middleNames", e.target.value)
                                    }
                                />
                            </Form.Item>
                            <Form.Item label="Email">
                                <Input
                                    placeholder="Email"
                                    size="large"
                                    onChange={(e) => handleFormChange("email", e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item label="Address">
                                <Input
                                    placeholder="Address"
                                    size="large"
                                    onChange={(e) => handleFormChange("address", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Password">
                                <Input
                                    placeholder="password"
                                    value={"PASSWORD"}
                                    className="bg-grey text-white"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item label="Occupation">
                                <Input
                                    placeholder="Occupation"
                                    size="large"
                                    onChange={(e) =>
                                        handleFormChange("occupation", e.target.value)
                                    }
                                />
                            </Form.Item>
                            <Form.Item name="monthlyIncome" label="Monthly Income" initialValue={0}>
                                <Input
                                    placeholder="Monthly Income"
                                    size="large"
                                    type="number"
                                    onChange={(e) =>
                                        handleFormChange("monthlyIncome", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </div>

                        <div className="col-6">
                            <Form.Item
                                name="lastName"
                                label="Last name"
                                rules={[{required: true, message: 'Last name is required!'}]}
                            >
                                <Input
                                    placeholder="Last Name"
                                    size="large"
                                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Gender">
                                <Select
                                    placeholder="Gender"
                                    size="large"
                                    onChange={(value) => handleFormChange("gender", value)}
                                    options={[
                                        {label: "MALE", value: "MALE"},
                                        {label: "FEMALE", value: "FEMALE"},
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone number"
                                rules={[{len: 9, message: 'Number should have 9 characters'}]}
                            >
                                <Input
                                    addonBefore={phoneNumberPrefix}
                                    name="phoneNumber"
                                    className="w-100"
                                    size={"large"}
                                    type="number"
                                    min={9}
                                    maxLength={9}
                                />
                            </Form.Item>
                            <Form.Item label="Parent type">
                                <Select
                                    placeholder="Parent Role"
                                    size="large"
                                    onChange={(value) => handleFormChange("parentType", value)}
                                    options={[
                                        {label: "Father", value: "Father"},
                                        {label: "Mother", value: "Mother"},
                                        {label: "Guardian", value: "Guardian"},
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Single parent"
                                help="Mark if the parent is a single parent"
                            >
                                <Checkbox
                                    onChange={(e) =>
                                        handleFormChange("singleParent", e.target.checked)
                                    }
                                >
                                    Single parent
                                </Checkbox>
                            </Form.Item>
                            <Form.Item label="Employer Address">
                                <Input
                                    className="mt-2"
                                    placeholder="Employer Address"
                                    size="large"
                                    onChange={(e) => handleFormChange("employer_address", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="nationalId"
                                label="National Id"
                                rules={[{required: true, message: 'National Id is required!'}]}
                            >
                                <Input
                                    placeholder="63-232257R18"
                                    size="large"
                                    onInput={toInputUppercase}
                                    onChange={(e) =>
                                        handleFormChange("nationalId", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        icon={<PlusOutlined/>}
                        disabled={disabled}
                        block
                        htmlType={"submit"}
                    >
                        Add parent
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default NewParent;
