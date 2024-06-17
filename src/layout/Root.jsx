import { Link, Outlet, useNavigate, useNavigation } from "react-router-dom";
import Login from "../pages/authentication/Login";
import useToken from "../hooks/useToken";
import React, { useEffect } from "react";
import {
    BarChartOutlined,
    BellFilled,
    DashboardOutlined, FileTextOutlined,
    FormOutlined,
    GroupOutlined,
    InfoCircleOutlined, LogoutOutlined,
    PhoneOutlined,
    PieChartOutlined,
    QuestionOutlined,
    SolutionOutlined,
    TeamOutlined,
    UserOutlined,
    FolderOpenOutlined,
    UsergroupAddOutlined,
    BankOutlined,
    SafetyCertificateOutlined,
    MessageOutlined,
    SendOutlined,
    InboxOutlined,
    AuditOutlined,
    CarOutlined,
    BookOutlined,
    IdcardOutlined,
    FileDoneOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, Badge, Spin } from 'antd';
import AuthenticationService from "../services/authentication.service";
import './styles.css'
import logo from "../Assets/images/logo_.svg";
import facePlaceholder from "../Assets/images/user-placeholder.svg";
import { Header } from "antd/es/layout/layout";
import { InstitutionLogo, InstitutionName } from "../common";
import SystemFooter from "../common/SystemFooter";

const { Sider, Content, Footer } = Layout;

const items = [
    {
        key: 1,
        label: (
            <Link to="/" className='text-decoration-none'><QuestionOutlined />&nbsp; Help</Link>
        ),
    },
    {
        key: 2,
        danger: true,
        label: (
            <Link to="/" className='text-decoration-none'><LogoutOutlined />&nbsp; Sign out</Link>
        ),
        onClick: () => AuthenticationService.logout()
    },
];

const Root = () => {
    const { token, setToken } = useToken();
    const ROLE = AuthenticationService.getUserRole();

    const navigate = useNavigate();
    const navigation = useNavigation();

    const username = AuthenticationService.getUsername();
    const fullName = AuthenticationService.getFullName();

    const handleVerifyToken = async () => {
        const refreshToken = AuthenticationService.getRefreshToken();
        try {
            const refreshTokenResponse = await AuthenticationService.verifyToken({ token: refreshToken });
            if (refreshTokenResponse?.status === 200) {
                try {
                    const response = await AuthenticationService.verifyToken({ token: token });
                    if (response?.status === 200) {
                        return 1;
                    }
                } catch (e) {
                    if (e?.response?.status === 401) {
                        try {
                            const newTokenResponse = await AuthenticationService.refreshToken({ refresh: refreshToken });
                            if (newTokenResponse?.status === 200) {
                                setToken(newTokenResponse?.data);
                                window.location.reload();
                            }
                        } catch (e) {
                            window.location.reload();
                        }
                    }
                }
            } else {
                AuthenticationService.logout();
            }
        } catch (e) {
            AuthenticationService.logout();
        }
    }

    useEffect(
        () => {
            if (token) {
                handleVerifyToken();
            }
        }, [token]
    )

    if (!token) {
        return <Login setToken={setToken} />
    }

    const adminMenuItems = [
        {
            key: '1',
            icon: <DashboardOutlined style={{ marginLeft: 4 }} />,
            label: 'Dashboard',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("/")
        },
        {
            key: '2',
            icon: <SolutionOutlined style={{ marginLeft: 4 }} />,
            label: 'Student Management',
            children: [
                {
                    key: '3',
                    label: 'Students',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/students")
                },
                {
                    key: '4',
                    label: 'Admissions',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/new-student")
                }
            ]
        },
        {
            key: '18',
            icon: <TeamOutlined style={{ marginLeft: 4 }} />,
            label: 'Teacher Management',
            children: [
                {
                    key: '19',
                    label: 'Teachers',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/teachers")
                },
                {
                    key: '20',
                    label: 'Register',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/new-teacher")
                }
            ]
        },
        {
            key: 'parents',
            icon: <DashboardOutlined style={{ marginLeft: 4 }} />,
            label: 'Parent Management',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("admin/parents"),
        },
        {
            key: '6',
            icon: <GroupOutlined style={{ marginLeft: 4 }} />,
            label: 'Classroom Management',
            children: [
                {
                    key: '7',
                    label: 'Classes',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/student-classes")
                },
                {
                    key: '8',
                    label: 'Subject Allocations',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/subject-allocations")
                },
            ]
        },
        {
            key: '10',
            icon: <SendOutlined style={{ marginLeft: 4 }} />,
            label: 'Communications',
            children: [
                {
                    key: '11',
                    icon: <MessageOutlined style={{ marginLeft: 4 }} />,
                    label: 'SMS Management',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/sms-information"),
                    disabled: true
                },
                {
                    key: '12',
                    icon: <InboxOutlined style={{ marginLeft: 4 }} />,
                    label: 'Newsletters',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/newsletter")
                }
            ]
        },
        {
            key: 'hr',
            icon: <IdcardOutlined style={{ marginLeft: 4 }} />,
            label: 'Ancillary Staff Management',
            children: [
                {
                    key: 'hr1',
                    label: 'Staff',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/ancillary-staff")
                },
                {
                    key: 'hr2',
                    label: 'Payroll',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/ancillary-staff/payroll-records")
                },
            ]
        },
        {
            disabled: true,
            key: 'accounting',
            icon: <IdcardOutlined style={{ marginLeft: 4 }} />,
            label: 'Accounts',
            children: [
                {
                    key: 'transactions',
                    label: 'Transactions',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/accounting/transactions")
                },
                {
                    key: 'income_statements',
                    label: 'Income Statement',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/accounting/income-statement")
                },
            ]
        },
        {
            key: 'assetManagement',
            icon: <CarOutlined style={{ marginLeft: 4 }} />,
            label: 'Asset Management',
            disabled: false,
            children: [
                {
                    key: 'vehicle',
                    label: 'Vehicles',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/vehicles")
                },
                {
                    key: 'electronics',
                    label: 'Electronics',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/electronics")
                },
                {
                    key: 'general_asset',
                    label: 'General Assets',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/general-assets")
                }
            ]
        },
        {
            key: 'library',
            icon: <BookOutlined style={{ marginLeft: 4 }} />,
            label: 'Library Management',
            children: [
                {
                    key: 'libraries',
                    label: 'Libraries',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library")
                },
                {
                    key: 'libraryBooks',
                    label: 'Books',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library/books")
                },
                {
                    key: 'libraryLoans',
                    label: 'Book Loans',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library/book-loans")
                },
                {
                    key: 'myLibraryLoans',
                    label: 'My Book Loans',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("library/book-loans")
                },
                {
                    key: 'eBooks',
                    label: 'E-books',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("library/ebooks")
                },
            ]
        },
        {
            key: '14',
            icon: <PieChartOutlined style={{ marginLeft: 4 }} />,
            label: 'School Records',
            children: [
                {
                    key: '15',
                    label: 'Students',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/student-reports")
                },
                {
                    key: '16',
                    label: 'Teacher',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/teacher-reports")
                }
            ]
        },
        {
            key: 'liveClass',
            icon: <VideoCameraOutlined style={{ marginLeft: 4 }} />,
            label: 'Live classes',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/admin/live-classes')
        },
        {
            key: '9',
            icon: <FormOutlined style={{ marginLeft: 4 }} />,
            label: 'Exam Management',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/admin/examinations')
        },
        {
            key: 'adminStudentCoursework',
            icon: <InboxOutlined style={{ marginLeft: 4 }} />,
            label: 'Coursework Management',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("admin/coursework")
        },
        {
            key: '13',
            icon: <InfoCircleOutlined style={{ marginLeft: 4 }} />,
            label: 'School Information',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("admin/school-information")
        },
        {
            key: '17',
            icon: <UserOutlined style={{ marginLeft: 4 }} />,
            label: 'Profile',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("admin/account")
        },
        {
            key: '21',
            icon: <PhoneOutlined style={{ marginLeft: 4 }} />,
            label: 'Support',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' }
        },
        {
            key: '22',
            icon: <AuditOutlined style={{ marginLeft: 4 }} />,
            label: 'System logs',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("admin/system-logs")
        },
        {
            key: '23',
            icon: <LogoutOutlined style={{ marginLeft: 4 }} />,
            label: 'Logout',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%', backgroundColor: "red" },
            onClick: () => AuthenticationService.logout()
        },
    ]


    const studentMenuItems = [
        {
            key: '1',
            icon: <DashboardOutlined style={{ marginLeft: 4 }} />,
            label: 'Dashboard',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/student/dashboard')
        },
        {
            key: '2',
            icon: <FileTextOutlined style={{ marginLeft: 4 }} />,
            label: 'My Subjects',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/student/subjects')

        },
        {
            key: 'liveClass',
            icon: <VideoCameraOutlined style={{ marginLeft: 4 }} />,
            label: 'Live classes',
            style: {borderRadius: 0, margin: '0 0 5px', width: '100%'},
            onClick: () => navigate('/student/live-classes'),
        },
        {
            key: '3',
            icon: <BarChartOutlined style={{ marginLeft: 4 }} />,
            label: 'My Results',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/student/end-term-results')
        },
        {
            key: '4',
            icon: <InboxOutlined style={{ marginLeft: 4 }} />,
            label: 'Newsletters',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("student/newsletter")
        },
        {
            key: 'studentCoursework',
            icon: <InboxOutlined style={{ marginLeft: 4 }} />,
            label: 'Coursework',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("student/coursework")
        },
        {
            key: 'library',
            icon: <BookOutlined style={{ marginLeft: 4 }} />,
            label: 'Library',
            children: [
                AuthenticationService.getIsLibrarian() && {
                    key: 'libraries',
                    label: 'Libraries',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library")
                },
                AuthenticationService.getIsLibrarian() && {
                    key: 'libraryBooks',
                    label: 'Books',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library/books")
                },
                AuthenticationService.getIsLibrarian() && {
                    key: 'libraryLoans',
                    label: 'Book Loans',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library/book-loans")
                },
                {
                    key: 'myLibraryLoans',
                    label: 'My Book Loans',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("library/book-loans")
                },
                {
                    key: 'eBooks',
                    label: 'E-books',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("library/ebooks")
                },
            ]
        },
        {
            key: '5',
            icon: <UserOutlined style={{ marginLeft: 4 }} />,
            label: 'Profile',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/student/account')
        },
        {
            key: '6',
            icon: <LogoutOutlined style={{ marginLeft: 4 }} />,
            label: 'Logout',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%', backgroundColor: "red" },
            onClick: () => AuthenticationService.logout()
        },
    ]

    const teacherMenuItems = [
        {
            key: '1',
            icon: <DashboardOutlined style={{ marginLeft: 4 }} />,
            label: 'Dashboard',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("teacher/dashboard")
        },
        {
            key: '2',
            icon: <FolderOpenOutlined style={{ marginLeft: 4 }} />,
            label: 'My subjects',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("teacher/subjects")
        },
        {
            key: 'liveClass',
            icon: <VideoCameraOutlined style={{ marginLeft: 4 }} />,
            label: 'Live classes',
            style: {borderRadius: 0, margin: '0 0 5px', width: '100%'},
            onClick: () => navigate('/teacher/live-classes'),
        },
        {
            key: '3',
            icon: <GroupOutlined style={{ marginLeft: 4 }} />,
            label: 'My classes',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/teacher/classes')
        },
        {
            key: '5',
            icon: <GroupOutlined style={{ marginLeft: 4 }} />,
            label: 'Exam management',
            children: [
                {
                    key: '6',
                    icon: <FormOutlined style={{ marginLeft: 4 }} />,
                    label: 'Set student marks',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate('/teacher/examinations')
                },
            ]
        },
        {
            key: '7',
            icon: <SendOutlined style={{ marginLeft: 4 }} />,
            label: 'Communications',
            children: [
                {
                    key: '8',
                    icon: <InboxOutlined style={{ marginLeft: 4 }} />,
                    label: 'Newsletters',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("teacher/newsletter")
                }
            ]
        },
        {
            key: 'library',
            icon: <BookOutlined style={{ marginLeft: 4 }} />,
            label: 'Library',
            children: [
                AuthenticationService.getIsLibrarian() && {
                    key: 'libraries',
                    label: 'Libraries',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library")
                },
                AuthenticationService.getIsLibrarian() && {
                    key: 'libraryBooks',
                    label: 'Books',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library/books")
                },
                AuthenticationService.getIsLibrarian() && {
                    key: 'libraryLoans',
                    label: 'Book Loans',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("admin/library/book-loans")
                },
                {
                    key: 'myLibraryLoans',
                    label: 'My Book Loans',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("library/book-loans")
                },
                {
                    key: 'eBooks',
                    label: 'E-books',
                    style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
                    onClick: () => navigate("library/ebooks")
                },
            ]
        },
        {
            key: 'teacherCoursework',
            icon: <FileDoneOutlined style={{ marginLeft: 4 }} />,
            label: 'Coursework',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/teacher/coursework')
        },
        {
            key: '9',
            icon: <UserOutlined style={{ marginLeft: 4 }} />,
            label: 'Profile',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/teacher/account')
        },
        {
            key: '10',
            icon: <LogoutOutlined style={{ marginLeft: 4 }} />,
            label: 'Logout',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%', backgroundColor: "red" },
            onClick: () => AuthenticationService.logout()
        },
    ]

    const superUserMenuItems = [
        {
            key: '1',
            icon: <DashboardOutlined style={{ marginLeft: 4 }} />,
            label: 'Dashboard',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/')
        },
        {
            key: '2',
            icon: <UserOutlined style={{ marginLeft: 4 }} />,
            label: 'Clients',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('superadmin/clients')
        },
        {
            key: 'institution',
            icon: <BankOutlined style={{ marginLeft: 4 }} />,
            label: 'Institutions',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('superadmin/institutions')
        },
        {
            key: '4',
            icon: <SafetyCertificateOutlined style={{ marginLeft: 4 }} />,
            label: 'Institution administrators',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('superadmin/institution-administrators')
        },
        {
            key: '5',
            icon: <UsergroupAddOutlined style={{ marginLeft: 4 }} />,
            label: 'Product Demo Requests',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('superadmin/demo-requests')
        },
        {
            key: '6',
            icon: <LogoutOutlined style={{ marginLeft: 4 }} />,
            label: 'Logout',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%', backgroundColor: "red" },
            onClick: () => AuthenticationService.logout()
        },
    ]

    const parentMenuItems = [
        {
            key: '1',
            icon: <DashboardOutlined style={{ marginLeft: 4 }} />,
            label: 'Dashboard',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("parent/dashboard")
        },
        // {
        //     key: '2',
        //     icon: <MoneyCollectOutlined style={{marginLeft: 4}}/>,
        //     label: 'Fees Payments',
        //     style: {borderRadius: 0, margin: '0 0 5px', width: '100%'},
        //     onClick: () => navigate('/parent/fees-payments')
        // },
        {
            key: '3',
            icon: <FileTextOutlined style={{ marginLeft: 4 }} />,
            label: "My Children's Classes",
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/parent/children-classes')
        },
        {
            key: '8',
            icon: <BarChartOutlined style={{ marginLeft: 4 }} />,
            label: "My Children's Coursework",
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/parent/children-coursework')
        },
        {
            key: '4',
            icon: <BarChartOutlined style={{ marginLeft: 4 }} />,
            label: "My Children's Results",
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/parent/children-reports')
        },
        {
            key: '5',
            icon: <InboxOutlined style={{ marginLeft: 4 }} />,
            label: 'Newsletters',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate("parent/newsletters")
        },
        {
            key: '6',
            icon: <UserOutlined style={{ marginLeft: 4 }} />,
            label: 'Profile',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%' },
            onClick: () => navigate('/parent/profile')
        },
        {
            key: '7',
            icon: <LogoutOutlined style={{ marginLeft: 4 }} />,
            label: 'Logout',
            style: { borderRadius: 0, margin: '0 0 5px', width: '100%', backgroundColor: "red" },
            onClick: () => AuthenticationService.logout()
        },
    ]

    const Loader = () => {
        return (
            <div className='h-75 d-flex justify-content-center align-items-center flex-column'>
                <Spin size={"large"} />
                <p className='fw-semibold mt-2'>Loading</p>
            </div>
        )
    }

    return (
        <div className={"container-fluid p-0"}>
            {
                ROLE === "ADMIN" && (
                    <Layout style={{ margin: "64px 0 0" }}>
                        <Header className={"ant-nav-bar"}>
                            <div className="navbar-brand ms-3 text-white d-flex justify-content-between align-items-center">
                                <InstitutionLogo />
                                <InstitutionName textColor='text-white' />
                            </div>
                            <div className={"w-100"}></div>
                            <div className='d-flex flex-row align-items-center justify-content-evenly text-white'>
                                <Badge showZero count={0} className='mx-3'>
                                    <BellFilled
                                        className='fs-4 text-white'
                                    />
                                </Badge>
                                <Dropdown className='btn btn-sm rounded-5' menu={{ items }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <span className='small text-white text-nowrap'>
                                                <span className={"d-none d-sm-inline text-nowrap"}>
                                                    {fullName} {" "}
                                                </span>
                                                {" "}{username}
                                            </span>
                                            <img src={facePlaceholder} className={"user-nav-img"} alt="User" />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        </Header>
                        <Layout hasSider>
                            <Sider
                                width={240}
                                theme={"dark"}
                                collapsedWidth="50px"
                                breakpoint="lg"
                                style={{
                                    overflow: 'auto',
                                    height: '100vh',
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0
                                }}
                            >
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    items={adminMenuItems}
                                    theme={"dark"}
                                    style={{ borderRight: 0, paddingTop: 75 }}
                                />
                            </Sider>

                            <Layout className="site-layout">
                                <Content
                                    style={{
                                        padding: 10,
                                        margin: 0,
                                        minHeight: '100vh',
                                    }}
                                >
                                    {navigation.state === "loading" ? <Loader /> : <Outlet />}
                                </Content>

                                <SystemFooter />
                            </Layout>
                        </Layout>
                    </Layout>
                )
            }

            {
                ROLE === "STUDENT" && (
                    <Layout style={{ margin: "66px 0 0" }}>
                        <Header className={"ant-nav-bar"}>
                            <div className="navbar-brand ms-3 text-white d-flex justify-content-between align-items-center">
                                <InstitutionLogo />
                                <InstitutionName />
                            </div>
                            <div className={"w-100"}></div>
                            <div className='d-flex flex-row align-items-center justify-content-evenly text-white'>
                                <Badge showZero count={0} className='mx-3'>
                                    <BellFilled
                                        className='fs-4 text-white'
                                    />
                                </Badge>
                                <Dropdown className='btn btn-sm rounded-5' menu={{ items }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <span className='small text-white text-nowrap'>
                                                <span className={"d-none d-sm-inline text-nowrap"}>
                                                    {fullName} {" "}
                                                </span>
                                                {" "}{username}
                                            </span>
                                            <img src={facePlaceholder} className={"user-nav-img"} alt="User" />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        </Header>
                        <Layout hasSider>
                            <Sider
                                width={240}
                                theme={"dark"}
                                collapsedWidth="50px"
                                breakpoint="lg"
                                style={{
                                    overflow: 'auto',
                                    height: '100vh',
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0
                                }}
                            >
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    items={studentMenuItems}
                                    theme={"dark"}
                                    style={{ borderRight: 0, paddingTop: 75 }}
                                />
                            </Sider>

                            <Layout className="site-layout">
                                <Content
                                    style={{
                                        padding: 10,
                                        margin: 0,
                                        minHeight: '100vh',
                                    }}
                                >
                                    {navigation.state === "loading" ? <Loader /> : <Outlet />}
                                </Content>
                                <SystemFooter />
                            </Layout>
                        </Layout>
                    </Layout>
                )
            }

            {
                ROLE === "TEACHER" && (
                    <Layout style={{ margin: "66px 0 0" }}>
                        <Header className={"ant-nav-bar"}>
                            <div className="navbar-brand ms-3 text-white d-flex justify-content-between align-items-center">
                                <InstitutionLogo />
                                <InstitutionName />
                            </div>
                            <div className={"w-100"}></div>
                            <div className='d-flex flex-row align-items-center justify-content-evenly text-white'>
                                <Badge showZero count={0} className='mx-3'>
                                    <BellFilled
                                        className='fs-4 text-white'
                                    />
                                </Badge>
                                <Dropdown className='btn btn-sm rounded-5' menu={{ items }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <span className='small text-white text-nowrap'>
                                                <span className={"d-none d-sm-inline text-nowrap"}>
                                                    {fullName} {" "}
                                                </span>
                                                {" "}{username}
                                            </span>
                                            <img src={facePlaceholder} className={"user-nav-img"} alt="User" />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        </Header>
                        <Layout hasSider>
                            <Sider
                                width={240}
                                theme={"dark"}
                                collapsedWidth="50px"
                                breakpoint="lg"
                                style={{
                                    overflow: 'auto',
                                    height: '100vh',
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0
                                }}
                            >
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    items={teacherMenuItems}
                                    theme={"dark"}
                                    style={{ borderRight: 0, paddingTop: 75 }}
                                />
                            </Sider>

                            <Layout className="site-layout">
                                <Content
                                    style={{
                                        padding: 10,
                                        margin: 0,
                                        minHeight: '100vh',
                                    }}
                                >
                                    {navigation.state === "loading" ? <Loader /> : <Outlet />}
                                </Content>
                                <SystemFooter />
                            </Layout>
                        </Layout>
                    </Layout>
                )
            }

            {
                ROLE === "SUPERUSER" && (
                    <Layout style={{ margin: "66px 0 0" }}>
                        <Header className={"ant-nav-bar"}>
                            <div className="navbar-brand ms-3 text-white d-flex justify-content-between align-items-center">
                                <img src={logo} height={50} alt={"School Logo"} />
                            </div>
                            <div className={"w-100"}></div>
                            <div className='d-flex flex-row align-items-center justify-content-evenly text-white'>
                                <Badge showZero count={0} className='mx-3'>
                                    <BellFilled
                                        className='fs-4 text-white'
                                    />
                                </Badge>
                                <Dropdown className='btn btn-sm rounded-5' menu={{ items }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <span className='small text-white text-nowrap'>
                                                <span className={"d-none d-sm-inline text-nowrap"}>
                                                    {fullName} {" "}
                                                </span>
                                                {" "}{username}
                                            </span>
                                            <img src={facePlaceholder} className={"user-nav-img"} alt="User" />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        </Header>
                        <Layout hasSider>
                            <Sider
                                width={240}
                                theme={"dark"}
                                collapsedWidth="50px"
                                breakpoint="lg"
                                style={{
                                    overflow: 'auto',
                                    height: '100vh',
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0
                                }}
                            >
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    items={superUserMenuItems}
                                    theme={"dark"}
                                    style={{ borderRight: 0, paddingTop: 75 }}
                                />
                            </Sider>

                            <Layout className="site-layout">
                                <Content
                                    style={{
                                        padding: 10,
                                        margin: 0,
                                        minHeight: '100vh',
                                    }}
                                >
                                    {navigation.state === "loading" ? <Loader /> : <Outlet />}
                                </Content>
                                <SystemFooter />
                            </Layout>
                        </Layout>
                    </Layout>
                )
            }

            {
                ROLE === "PARENT" && (
                    <Layout style={{ margin: "66px 0 0" }}>
                        <Header className={"ant-nav-bar"}>
                            <div className="navbar-brand ms-3 text-white d-flex justify-content-between align-items-center">
                                <img src={logo} height={50} alt={"School Logo"} />
                            </div>
                            <div className={"w-100"}></div>
                            <div className='d-flex flex-row align-items-center justify-content-evenly text-white'>
                                <Badge showZero count={0} className='mx-3'>
                                    <BellFilled
                                        className='fs-4 text-white'
                                    />
                                </Badge>
                                <Dropdown className='btn btn-sm rounded-5' menu={{ items }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <span className='small text-white text-nowrap'>
                                                <span className={"d-none d-sm-inline text-nowrap"}>
                                                    {fullName} {" "}
                                                </span>
                                                {" "}{username}
                                            </span>
                                            <img src={facePlaceholder} className={"user-nav-img"} alt="User" />
                                        </Space>
                                    </a>
                                </Dropdown>
                            </div>
                        </Header>
                        <Layout hasSider>
                            <Sider
                                width={240}
                                theme={"dark"}
                                collapsedWidth="50px"
                                breakpoint="lg"
                                style={{
                                    overflow: 'auto',
                                    height: '100vh',
                                    position: 'fixed',
                                    left: 0,
                                    top: 0,
                                    bottom: 0
                                }}
                            >
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    items={parentMenuItems}
                                    theme={"dark"}
                                    style={{ borderRight: 0, paddingTop: 75 }}
                                />
                            </Sider>

                            <Layout className="site-layout">
                                <Content
                                    style={{
                                        padding: 10,
                                        margin: 0,
                                        minHeight: '100vh',
                                    }}
                                >
                                    {navigation.state === "loading" ? <Loader /> : <Outlet />}
                                </Content>
                                <SystemFooter />
                            </Layout>
                        </Layout>
                    </Layout>
                )
            }
        </div>
    )
}

export default Root;