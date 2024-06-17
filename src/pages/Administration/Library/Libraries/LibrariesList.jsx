import { Button, Card, Divider, List, message, Popconfirm, Tag, Tooltip} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined, MoreOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {Link, useLoaderData} from "react-router-dom";
import {useState} from "react";
import AuthenticationService from "../../../../services/authentication.service";
import {handleError, refreshPage} from "../../../../common";
import CreateLibrary from "./CreateLibrary";
import libraryIcon from "../../../../Assets/images/library-icon.svg";
import LibraryService from "../../../../services/library.service";

export async function librariesLoader() {
    try {
        const librariesResponse = await LibraryService.getAllByInstitution(AuthenticationService.getUserTenantId());
        return {libraries: librariesResponse.data};
    } catch (e) {
        console.log(e);
        return {libraries: []};
    }
}

const LibrariesList = () => {
    const [openCreateLibraryModal, setOpenCreateLibraryModal] = useState(false);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const { libraries } = useLoaderData();

    const closeCreateLibraryModal = () => {
        setSelectedLibrary(null)
        setOpenCreateLibraryModal(false)
    }

    const deleteLibrary = async (item) => {
        try {
            const response = await LibraryService.delete(item.id);
            if (response.status === 200) {
                message.success(`Library has been deleted`);
                refreshPage()
            } else {
                await message.error(`Library has not been deleted`);
            }
        } catch (e) {
            handleError(e)
        }
    }

    const getBooksLink = (libraryId) => (`/admin/library/${libraryId}`)

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Libraries</h3>
                {AuthenticationService.getUserRole() === "ADMIN" && <Button
                    icon={<PlusOutlined/>}
                    className='border-0 px-3 text-white'
                    type="primary"
                    onClick={() => setOpenCreateLibraryModal(true)}
                >
                    Create Library
                </Button>}
            </div>

            <Divider type={"horizontal"}/>

            <List
                itemLayout="vertical"
                grid={{
                    xs: 1,
                    sm: 2,
                    md: 2,
                    lg: 3,
                    xl: 4,
                    xxl:4,
                    gutter: 0
                }}
                size="large"
                pagination={{
                    xs: false,
                    sm: false,
                    lg: 6,
                    xl: 8,
                    xxl: 8
                }}
                dataSource={libraries}
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        style={{ margin: "12px", padding: 0 }}
                    >
                        <Card
                            style={{ minHeight: 392, height: "100%", position: "relative" }}
                            cover={
                                <img
                                    alt="example"
                                    className="p-4 card-bg-light"
                                    style={{objectFit: "cover"}}
                                    src={libraryIcon}
                                />
                            }
                        >
                            <Link to={getBooksLink(item.id)} className="text-success text-decoration-none">
                                <h5>{item.name}</h5>
                            </Link>
                            <p className="mb-3 mt-1">Contact: {item.contact_info}</p>
                            <small>Librarians: {item.librarians?.map((librarian, index) => (
                                <Tag key={index} bordered={false} color="gold">{librarian.firstName} {librarian.lastName}</Tag>
                            ))}
                            </small>

                            {AuthenticationService.getUserRole() === "ADMIN" && <Tooltip title="Options">
                                <Button
                                    data-bs-toggle="dropdown" aria-expanded="false"
                                    type="text"
                                    shape="circle"
                                    icon={<MoreOutlined/>}
                                    style={{
                                        position: "absolute",
                                        right: 8,
                                        top: 8,
                                    }}
                                />
                            </Tooltip>}
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to={getBooksLink(item.id)} className="dropdown-item">
                                        <EyeOutlined /> View
                                    </Link>
                                </li>
                                <li>
                                    <a onClick={() => {
                                        setSelectedLibrary(item);
                                        setOpenCreateLibraryModal(true);
                                    }} className="dropdown-item">
                                        <EditOutlined /> Edit Library
                                    </a>
                                </li>
                                <li>
                                    <Popconfirm
                                        title="Delete Class"
                                        description="Are you sure you want to delete this library?"
                                        onConfirm={() => deleteLibrary(item)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <a className="dropdown-item text-danger">
                                            <DeleteOutlined /> Delete Library
                                        </a>
                                    </Popconfirm>
                                </li>
                            </ul>
                        </Card>
                    </List.Item>
                )}
            />

            <CreateLibrary
                open={openCreateLibraryModal}
                close={() => closeCreateLibraryModal()}
                library={selectedLibrary}
            />

        </>
    )
}

export default LibrariesList;