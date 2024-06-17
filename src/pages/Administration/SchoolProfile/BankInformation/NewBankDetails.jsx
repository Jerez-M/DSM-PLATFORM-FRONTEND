import {Button, Form, Input, message, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import BankAccountService from "../../../../services/bank-account.service";
import AuthenticationService from "../../../../services/authentication.service";
import {useState} from "react";
import {handleError, refreshPage} from "../../../../common";

const NewBankDetail = ({open, close, schoolBankDetails}) => {
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [formData, setFormData] = useState({
        bankName: "",
        accountName: "",
        accountNumber: "",
        swiftCode: "",
        branch: "",
        institution: 0
    })

    const handleFormChange = (fieldName, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async () => {
        setDisabled(true);
        setLoading(true);

        const bankData = { ...formData, institution: AuthenticationService.getUserTenantId() }
        try {
            const response = await BankAccountService.create(bankData)

            if(response.status === 201) {
                setLoading(false)
                setDisabled(false);
                message.success("New Bank Detail created successfully")
                refreshPage()
                close()
            }
        } catch (e) {
            setLoading(false)
            setDisabled(false);
            handleError(e)
        }
    }

    return (
        <Modal
            title={schoolBankDetails ? "Edit Banking Details" : "Add New Banking Details"}
            open={open}
            onCancel={close}
            okButtonProps={{
                className: "d-none",
            }}
            cancelButtonProps={{
                className: "d-none",
            }}
        >
            <Form layout={"vertical"}  onFinish={handleSubmit}>
                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Item
                            name='bankName'
                            label='Bank Name'
                            rules={[{ required: true, message: 'Bank name is required!' }]}
                        >
                            <Input
                                onChange={e => handleFormChange("bankName", e.target.value)}
                                name="bankName"
                                size={"large"}
                                required/>
                        </Form.Item>
                    </div>
                    <div className='col-md-6'>
                        <Form.Item
                            name='accountName'
                            label='Account Name'
                            rules={[{ required: true, message: 'Account name is required!' }]}
                        >
                            <Input
                                onChange={e => handleFormChange("accountName", e.target.value)}
                                name="accountName"
                                size={"large"}
                                required/>
                        </Form.Item>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-6'>
                        <Form.Item
                            name='accountNumber'
                            label='Account Number'
                            rules={[{ required: true, message: 'Account Number is required!' }]}
                        >
                            <Input
                                onChange={e => handleFormChange("accountNumber", e.target.value)}
                                name="accountNumber"
                                size={"large"}
                                required/>
                        </Form.Item>
                    </div>
                    <div className='col-md-6'>
                        <Form.Item name='swiftCode' label='Swift Code'>
                            <Input
                                onChange={e => handleFormChange("swiftCode", e.target.value)}
                                name="swiftCode"
                                size={"large"}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                        <Form.Item
                            name='branch'
                            label='Branch name'
                            rules={[{ required: true, message: 'Branch name is required!' }]}
                        >
                            <Input
                                onChange={e => handleFormChange("branch", e.target.value)}
                                name="branch"
                                size={"large"}
                                required/>
                        </Form.Item>
                    </div>
                </div>

                <Button
                    icon={<PlusOutlined/>}
                    type="primary"
                    size="large"
                    loading={loading}
                    disabled={disabled}
                    htmlType="submit"
                    block
                >
                    {schoolBankDetails ? "Edit Bank Details" : "Add Bank Details"}
                </Button>
            </Form>
        </Modal>
    )
}

export default NewBankDetail;