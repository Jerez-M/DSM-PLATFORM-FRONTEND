import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import InstitutionService from "../../../services/institution.service";
import COUNTRIES from "../../../utils/countries";
import _PROVINCES from "../../../utils/provinces";
import SEX from "../../../utils/school-students-gender";
import INSTITUTION_OWNER_TYPES from "../../../utils/institution-owner-types";
import INSTITUTION_TYPES from "../../../utils/institution-types";
import InstitutionOwnerService from "../../../services/institution-owner.service";
import { refreshPage } from "../../../common";

const NewInstitution = ({ open, close }) => {
    const [form] = Form.useForm();
    const [institution_name, setInstitution_name] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email_address, setEmail_address] = useState('');
    const [address, setAddress] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [country, setCountry] = useState('');
    const [institution_type, setInstitution_type] = useState('');
    const [students_gender, setStudents_gender] = useState('');
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [ownership, setOwnership] = useState('');
    const [institutionOwner, setInstitutionOwner] = useState(null);
    const [institution_code, setInstitution_code] = useState('');

    const [newClientBtnLoader, setNewClientBtnLoader] = useState(false);
    const [newClientBtnDisabledState, setNewClientBtnDisabledState] = useState(false);

    const [clientsList, setClientsList] = useState([]);

    const _clientsList = clientsList.map(
        client => ({
            label: client?.name,
            value: client?.id
        })
    )

    async function clientsListLoader() {
        try {
            const response = await InstitutionOwnerService.getAll();
            if (response?.status === 200) {
                const clients = response.data;
                setClientsList(clients);
            }
        } catch (e) {
            return []
        }
    }

    const handleClearAddClientForm = () => {
        form.resetFields();
    }

    const handleCreateNewInstitutionOwner = async () => {
        setNewClientBtnLoader(true);
        setNewClientBtnDisabledState(true);

        const form = document.querySelector('#new-institution');
        const data = new FormData(form);
        data.append('institution_name', institution_name)
        data.append('phoneNumber', phoneNumber)
        data.append('email_address', email_address)
        data.append('address', address)
        data.append('district', district)
        data.append('province', province)
        data.append('country', country)
        data.append('institution_type', institution_type)
        data.append('students_gender', students_gender)
        data.append('mission', mission)
        data.append('vision', vision)
        data.append('ownership', ownership)
        data.append('institutionOwner', institutionOwner)
        data.append('institution_code', institution_code)

        try {
            const response = await InstitutionService.create(data)

            if (response?.status === 201) {
                message.success("Institution added successfully.")
                refreshPage()
            }
        } catch (e) {
            setNewClientBtnDisabledState(false);
            setNewClientBtnLoader(false);

            if (e?.response?.status === 400) {
                const data = e.response.data;
                Object.keys(data).forEach(key => {
                    const value = data[key][0];
                    message.error(`${key}: ${value}`);
                });
            }
            console.clear();
        }
    }

    const handleProvinceChange = (value) => {
        setProvince(value);
    }

    const handleCountryChange = (value) => {
        setCountry(value);
    }

    const handleInstitutionOwnerChange = (value) => {
        setInstitutionOwner(value);
    }

    const handleInstitutionOwnershipChange = (value) => {
        setOwnership(value);
    }

    const handleStudentsGenderChange = (value) => {
        setStudents_gender(value);
    }

    const handleInstitutionTypeChange = (value) => {
        setInstitution_type(value);
    }

    const PROVINCES = _PROVINCES.map(
        province => ({
            label: province,
            value: province
        })
    )

    const _COUNTRY = COUNTRIES.map(
        country => ({
            label: country?.name,
            value: country?.name
        })
    )

    useEffect(
        () => {
            clientsListLoader();
        }, []
    )

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
            width={1000}
            centered
        >
            <Form
                method='post'
                encType='multipart/form-data'
                id='new-institution'
                form={form}
                layout={"vertical"}
            >
                <div className='row'>
                    <div className='col-md-4'>
                        <Form.Item name="institutionOwner" label={"Institution responsible authority"}>
                            <Select options={_clientsList} size={"large"} placeholder="Institution responsible authority" onChange={handleInstitutionOwnerChange} />
                        </Form.Item>
                        <Form.Item name="institution_name" label={"Institution name"}>
                            <Input size={"large"} placeholder="Institution name" onChange={e => setInstitution_name(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="phone_number" label={"Phone number"}>
                            <Input size={"large"} placeholder="Phone number" onChange={e => setPhoneNumber(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="email" label={"Email"}>
                            <Input size={"large"} placeholder="Email" onChange={e => setEmail_address(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="address" label={"Address"}>
                            <Input size={"large"} placeholder="Address" onChange={e => setAddress(e.target.value)} />
                        </Form.Item>
                    </div>
                    <div className='col-md-4'>
                        <Form.Item name="institution_type" label={"Institution type"}>
                            <Select options={INSTITUTION_TYPES} size={"large"} placeholder="Institution type" onChange={handleInstitutionTypeChange} />
                        </Form.Item>
                        <Form.Item name="ownership" label={"Ownership"}>
                            <Select options={INSTITUTION_OWNER_TYPES} size={"large"} placeholder="Ownership" onChange={handleInstitutionOwnershipChange} />
                        </Form.Item>
                        <Form.Item name="students_gender" label={"Students gender"}>
                            <Select options={SEX} size={"large"} placeholder="Students gender" onChange={handleStudentsGenderChange} />
                        </Form.Item>
                        <Form.Item name="mission" label={"Mission"}>
                            <Input size={"large"} placeholder="Mission" onChange={e => setMission(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="vision" label={"Vision"}>
                            <Input size={"large"} placeholder="Vision" onChange={e => setVision(e.target.value)} />
                        </Form.Item>
                    </div>
                    <div className='col-md-4'>
                        <Form.Item name="institution_code" label={"Institution code"}>
                            <Input size={"large"} placeholder="Institution code" onChange={e => setInstitution_code(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="district" label={"District"}>
                            <Input size={"large"} placeholder="District" onChange={e => setDistrict(e.target.value)} />
                        </Form.Item>
                        <Form.Item name="province" label={"Province"}>
                            <Select
                                showSearch
                                options={PROVINCES}
                                size={"large"}
                                placeholder="Province"
                                onChange={handleProvinceChange}
                            />
                        </Form.Item>
                        <Form.Item name="country" label={"Country"}>
                            <Select
                                showSearch
                                options={_COUNTRY}
                                size={"large"}
                                placeholder="Country"
                                onChange={handleCountryChange}
                            />
                        </Form.Item>
                        {/*<Form.Item label='Institution logo' help="Please select the institution's logo/badge.">*/}
                        {/*    <Input*/}
                        {/*        size={"large"}*/}
                        {/*        type='file'*/}
                        {/*        accept="image/png, image/gif, image/jpeg"*/}
                        {/*        name='logo'*/}
                        {/*    />*/}
                        {/*</Form.Item>*/}
                    </div>
                </div>

                <Button
                    size={"large"}
                    loading={newClientBtnLoader}
                    disabled={newClientBtnDisabledState}
                    onClick={handleCreateNewInstitutionOwner}
                    style={{ background: '#39b54a' }}
                    className={"text-light"}
                    block
                >
                    Add institution
                </Button>
            </Form>
        </Modal>
    )
}

export default NewInstitution;