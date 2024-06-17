import {Button, Divider, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import NewInstitutionAdministrator from "./NewInstitutionAdministrator";
import AdministratorService from "../../../services/administrator.service";
import {useLoaderData, useNavigate} from "react-router-dom";


export async function administratorsListLoader() {
    try {
        const response = await AdministratorService.getAllAdministrators();
        if(response?.status === 200) {
            const administrators = response.data;
            return { administrators };
        }
    } catch (e) {
        return []
    }
}
const InstitutionAdministratorsList = () => {
    const { administrators } = useLoaderData();
    const navigate = useNavigate();

    const _administrators = administrators.map(
        (i, key) => ({
            id: i.user.username,
            firstName: i.user.firstName,
            lastName: i.user.lastName,
            middleNames: i.user.middleNames,
            gender: i.user.gender,
            email: i.user.email,
            phoneNumber: i.user.phoneNumber,
            tenant: i.user.tenant,
            key
        })
    )

    const administratorListTableColumns = [
        {
            title: 'Administrator ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Institution ID',
            dataIndex: 'tenant',
            key: 'tenant'
        },
        {
            title: 'First name',
            dataIndex: 'firstName',
            key: 'firstName'
        },
        {
            title: 'Last name',
            dataIndex: 'lastName',
            key: 'lastName'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Email address',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        }
    ]
    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Institution administrators</h3>

                <Button
                    icon={<PlusOutlined/>}
                    className='border-0 px-3 text-white'
                    style={{background: '#39b54a'}}
                    onClick={() => navigate('/superadmin/institution-administrators/add')}
                >
                    Add institution administrator
                </Button>
            </div>
            <Divider type={"horizontal"}/>

            <Table
                dataSource={_administrators}
                columns={administratorListTableColumns}
                bordered={true}
                className="table-responsive"
            />
        </>
    )
}

export default InstitutionAdministratorsList;