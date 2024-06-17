import {Button, Divider, Table} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import InstitutionService from "../../../services/institution.service";
import NewInstitution from "./NewInstitution";
import {useLoaderData, useNavigate} from "react-router-dom";


export async function institutionsByClientListLoader({ params }) {
    try {
        const response = await InstitutionService.getByInstitutionOwnerId(params.id);
        if(response?.status === 200) {
            const institutions = response.data;
            return { institutions };
        }
    } catch (e) {
        return []
    }
}
const InstitutionsListByClient = () => {
    const { institutions } = useLoaderData();
    const navigate = useNavigate();
    const [newInstitutionModalState, setNewInstitutionModalState] = useState(false);

    const _institutions = institutions.map(
        (i, key) => ({
            ...i,
            key
        })
    )

    const institutionListTableColumns = [
        {
            title: 'Institution ID',
            dataIndex: 'tenant_id',
            key: 'tenant_id'
        },
        {
            title: 'Institution name',
            dataIndex: 'institution_name',
            key: 'institution_name'
        },
        {
            title: 'Phone number',
            dataIndex: 'phone_number',
            key: 'phone_number'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Email address',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province'
        },
        {
            title: 'Owner client ID',
            dataIndex: 'institutionOwner',
            key: 'institutionOwner'
        },
        {
            title: 'Status',
            dataIndex: '',
            key: '',
            render: (record) => {
                if(record?.active === true) {
                    return (<span className="badge rounded-pill text-bg-primary">Active</span>)
                } else {
                    return (<span className="badge rounded-pill text-bg-danger">Inactive</span>)
                }
            }
        }
    ]
    return (
        <div className={"overflow-x-hidden"}>
            <div className='d-flex justify-content-between align-items-center'>
                <ArrowLeftOutlined
                    onClick={() => navigate('/superadmin/clients')}
                />

                <Button
                    icon={<PlusOutlined/>}
                    className='border-0 px-3 text-white'
                    style={{background: '#39b54a'}}
                    onClick={() => setNewInstitutionModalState(true)}
                >
                    Add new institution
                </Button>
            </div>
            <Divider type={"horizontal"}/>

            <Table
                dataSource={_institutions}
                columns={institutionListTableColumns}
                bordered={true}
                className="table-responsive"
            />

            <NewInstitution
                open={newInstitutionModalState}
                close={() => setNewInstitutionModalState(false)}
            />

        </div>
    )
}

export default InstitutionsListByClient;