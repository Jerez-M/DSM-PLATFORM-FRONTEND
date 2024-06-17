import {Badge, Button, Card, Divider, List, message, Popconfirm, Tag, Tooltip, Typography} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined, MoreOutlined, PictureOutlined,
    PlusOutlined, SwapOutlined
} from "@ant-design/icons";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {useState} from "react";
import NewsletterService from "../../../services/newsletter.service";
import AuthenticationService from "../../../services/authentication.service";
import {fallbackImg, handleError, refreshPage, toHumanDate} from "../../../common";
import UpdateImageModal from "./UpdateImageModal";

export async function newslettersLoader() {
    try {
        const newslettersResponse = await NewsletterService.getAll(AuthenticationService.getUserTenantId());
        return {newsletters: newslettersResponse.data};
    } catch (e) {
        console.log(e);
    }
}

const NewsletterList = () => {
    const [openChangeImageModal, setOpenChangeImageModal] = useState(false)
    const [selectedNewsletter, setSelectedNewsletter] = useState(null);
    const { newsletters } = useLoaderData();
    const navigate = useNavigate();

    const closeCreateNewsletterModal = () => {
        setSelectedNewsletter(null)
        setOpenChangeImageModal(false)
    }

    const changeNewsletterPublishStatus = async (item) => {
        const formData = new FormData();
        for (const [key, value] of Object.entries(item)) {
            if (key !== 'image' || 'is_published') {
                formData.append(key, value);
            }
        }
        formData.set("is_published", !item.is_published ? "True" : "False");
        const response = await NewsletterService.update(item.id, formData);
        if (response.status === 200) {
            const statusName = !item.is_published ? "Published" : "Un-published";
            message.success(`Newsletter has been ${statusName} Successfully`);
            refreshPage();
        }
    }

    const deleteNewsletter = async (item) => {
        try {
            const response = await NewsletterService.delete(item.id);
            if (response.status === 200) {
                message.success(`Newsletter has been Un-published`);
                refreshPage()
            } else {
                await message.error(`Newsletter has not been deleted`);
            }
        } catch (e) {
            handleError(e)
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Newsletter</h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className='border-0 px-3 text-white'
                    onClick={() => navigate("/admin/newsletter/create")}
                >
                    Create Newsletter
                </Button>
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
                dataSource={newsletters}
                renderItem={(item) => (
                    <List.Item
                        key={item.title}
                        style={{ margin: "12px", padding: 0 }}
                    >
                        <Badge.Ribbon
                            placement="start"
                            text={item.is_published ? "Published" : "Not Published"}
                            color={item.is_published ? "green" : "red"}>
                            <Card
                                hoverable={false}
                                style={{ minHeight: 392, height: "100%", position: "relative" }}
                                cover={
                                    <img
                                        alt="example"
                                        id={`img-${item.id}`}
                                        height={200}
                                        style={{objectFit: "cover"}}
                                        src={item.image || fallbackImg}
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            currentTarget.src=fallbackImg;
                                        }}
                                    />
                                }
                            >
                                <Link to={`${item.id}`} className="text-success text-decoration-none">
                                    <h5>{item.title}</h5>
                                </Link>
                                <small>To: <Tag bordered={false} color={"blue"}>{item.audience}</Tag></small>
                                <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: "more"}} className="mt-2">
                                    <div dangerouslySetInnerHTML={{ __html: item.body }} />
                                </Typography.Paragraph>
                                <div className="d-md-flex justify-content-between align-items-center">
                                    <span className="text-muted">From: <strong>{item.author}</strong></span>
                                    <span>{toHumanDate(item.date_created)}</span>
                                </div>

                                <Tooltip title="Options">
                                    <Button
                                        data-bs-toggle="dropdown" aria-expanded="false"
                                        type="text"
                                        shape="circle"
                                        icon={<MoreOutlined />}
                                        style={{
                                            position: "absolute",
                                            right: 8,
                                            top: 8,
                                        }}
                                    />
                                </Tooltip>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to={`${item.id}`} className="dropdown-item">
                                            <EyeOutlined /> View
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/admin/newsletter/${item.id}/update`} className="dropdown-item">
                                            <EditOutlined /> Edit Newsletter
                                        </Link>
                                    </li>
                                    <li>
                                        <a onClick={() => {
                                            setSelectedNewsletter(item);
                                            setOpenChangeImageModal(true);
                                        }} className="dropdown-item">
                                            <PictureOutlined /> Change Image
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={() => changeNewsletterPublishStatus(item)} className="dropdown-item">
                                            <SwapOutlined /> {item.is_published ? "Un-publish Newsletter" : "Publish Newsletter"}
                                        </a>
                                    </li>
                                    <li>
                                        <Popconfirm
                                            title="Delete Class"
                                            description="Are you sure you want to delete this class?"
                                            onConfirm={() => deleteNewsletter(item)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <a className="dropdown-item text-danger">
                                                <DeleteOutlined /> Delete Newsletter
                                            </a>
                                        </Popconfirm>
                                    </li>
                                </ul>
                            </Card>
                        </Badge.Ribbon>
                    </List.Item>
                )}
            />

            <UpdateImageModal
                open={openChangeImageModal}
                close={() => closeCreateNewsletterModal()}
                newsletter={selectedNewsletter}
            />
        </>
    )
}

export default NewsletterList;