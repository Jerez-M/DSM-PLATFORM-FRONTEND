import {Button, Form, Input, message, Modal} from "antd";
import {useState} from "react";
import InstitutionOwnerService from "../../../services/institution-owner.service";

const NewClient = ({open, close}) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');

    const [newClientBtnLoader, setNewClientBtnLoader] = useState(false);
    const [newClientBtnDisabledState, setNewClientBtnDisabledState] = useState(false);

    const handleClearAddClientForm = () => {
        form.resetFields();
    }

    const handleCreateNewInstitutionOwner = async () => {
        setNewClientBtnLoader(true);
        setNewClientBtnDisabledState(true);

        try {
            const response = await InstitutionOwnerService.create({
                name,
                phoneNumber,
                email,
                website: `https://${website}`,
                address
            })

            if(response?.status === 201) {
                setNewClientBtnDisabledState(false);
                setNewClientBtnLoader(false);
                message.success("Client added successfully.")
                handleClearAddClientForm();
                setName('');
                setEmail('');
                setWebsite('');
                setPhoneNumber('');
                setAddress('');
                close();
                window.location.reload();
            }
        } catch (e) {
            setNewClientBtnDisabledState(false);
            setNewClientBtnLoader(false);

            if(e?.response?.status === 400) {
                const data = e.response.data;
                Object.keys(data).forEach(key => {
                    const value = data[key][0];
                    message.error(`${key}: ${value}`);
                });
            }
            console.clear();
        }
    }

    return (
        <Modal
            open={open}
            onCancel={() => close()}
            okButtonProps={{
                className: 'd-none'
            }}
            cancelButtonProps={{
                className: 'd-none'
            }}
            destroyOnClose={true}
        >
            <Form form={form} layout={"vertical"}>
                <Form.Item name="client_name" label={"Client name"}>
                    <Input size={"large"} placeholder="Client name" onChange={e => setName(e.target.value)} />
                </Form.Item>
                <Form.Item name="phone_number" label={"Phone number"}>
                    <Input size={"large"} placeholder="Phone number" onChange={e => setPhoneNumber(e.target.value)} />
                </Form.Item>
                <Form.Item name="email" label={"Email"}>
                    <Input size={"large"} placeholder="Email" onChange={e => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item name="address" label={"Address"}>
                    <Input size={"large"} placeholder="Address" onChange={e => setAddress(e.target.value)} />
                </Form.Item>
                <Form.Item name="website" label={"Website"}>
                    <Input size={"large"} placeholder="Website" onChange={e => setWebsite(e.target.value)} />
                </Form.Item>

                <Button
                    size={"large"}
                    loading={newClientBtnLoader}
                    disabled={newClientBtnDisabledState}
                    onClick={handleCreateNewInstitutionOwner}
                    style={{background: '#39b54a'}}
                    className={"text-light"}
                    block
                >
                    Add client
                </Button>
            </Form>
        </Modal>
    )
}

export default NewClient;