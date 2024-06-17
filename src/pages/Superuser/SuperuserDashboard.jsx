import {Button, Divider, Dropdown, Space} from "antd";
import {
    ClockCircleOutlined,
    DownOutlined
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import StudentService from "../../services/student.service";
import {useEffect, useState} from "react";
import InstitutionService from "../../services/institution.service";

const SuperuserDashboard = () => {
    const [totalNumberOfStudents, setTotalNumberOfStudents] = useState({});
    const [totalNumberOfInstitutions, setTotalNumberOfInstitutions] = useState({});

    async function fetchStats() {
        try {
            const _students = await StudentService.getTotalNumberOfStudents();
            const _institutions = await InstitutionService.getTotalNumberOfInstitutions();

            setTotalNumberOfStudents(_students.data);
            setTotalNumberOfInstitutions(_institutions.data);
        } catch (e) {
            setTotalNumberOfStudents({});
            setTotalNumberOfInstitutions({});
        }
    }
    const navigate = useNavigate();

    const items = [
        {
            label: 'Add new client',
            key: '1',
            onClick: () => navigate("superadmin/clients")
        },
        {
            label: 'Add new institution',
            key: '2',
            onClick: () => navigate("superadmin/institutions")
        },
        {
            label: 'View clients',
            key: '3',
            onClick: () => navigate("superadmin/clients")
        }
    ];

    const menuProps = {
        items,
    };

    useEffect(
        () => {
            fetchStats();
        }, []
    )

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Superuser Dashboard</h3>
                <Dropdown menu={menuProps}>
                    <Button
                        icon={<ClockCircleOutlined />}
                        className='border-0 px-3 text-white'
                        style={{background: '#39b54a'}}
                    >
                        <Space>
                            Quick actions...
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
            <Divider className='my-3' type={"horizontal"}/>

            <div className='row gy-3'>
                <div className='col-md-6'>
                    <div className='card border-0 shadow-sm rounded-1'>
                        <div className='card-header p-0 bg-dark text-white'>
                            <p className='text-center m-0'>Institutions</p>
                        </div>
                        <div className='card-body'>
                            <p className='text-center h2'>{totalNumberOfInstitutions?.total_institutions}</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card border-0 shadow-sm rounded-1'>
                        <div className='card-header p-0 bg-dark text-white'>
                            <p className='text-center m-0'>Students</p>
                        </div>
                        <div className='card-body'>
                            <p className='text-center h2'>{totalNumberOfStudents?.total_students}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SuperuserDashboard;