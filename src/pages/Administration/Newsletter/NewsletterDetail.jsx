import NewsletterService from "../../../services/newsletter.service";
import {useNavigate , useLoaderData} from "react-router-dom";
import {fallbackImg, toHumanDate} from "../../../common";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {Button, Card, Divider, Tag, Typography} from "antd";
import "./newsletter.css"
import AuthenticationService from "../../../services/authentication.service";

export async function newsletterLoader({params}) {
    try {
        const newsletterResponse = await NewsletterService.getById(params.id);
        return {newsletter: newsletterResponse.data};
    } catch (e) {
        console.log(e);
    }
}

const NewsletterDetail = () => {
    const {newsletter} = useLoaderData();
    const navigate = useNavigate();

    return (
        <>
            <Button
                onClick={() => navigate(-1)}
                className='text-muted text-decoration-none mb-2 d-flex align-items-center'
                type="text"
            >
                <ArrowLeftOutlined /> Back
            </Button>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Newsletter</h3>
                {AuthenticationService.getUserRole() === "ADMIN" && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        className='border-0 px-3 text-white'
                        onClick={() => navigate(`/admin/newsletter/${newsletter?.id}/update`)}
                    >
                        Edit Newsletter
                    </Button>
                )}
            </div>

            <Divider/>

            <div className="newsletter-large">
                <Card
                    style={{ height: "100%" }}
                    cover={<img
                        alt="example"
                        id={`img-${newsletter?.id}`}
                        style={{objectFit: "cover"}}
                        src={newsletter?.image || fallbackImg}
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src=fallbackImg;
                        }}
                    />}
                >
                    <h5>{newsletter?.title}</h5>
                    <small>To: <Tag bordered={false} color={"blue"}>{newsletter?.audience}</Tag></small>
                    <Divider />
                    <Typography.Paragraph className="mt-2">
                        <div dangerouslySetInnerHTML={{ __html: newsletter.body }} />
                    </Typography.Paragraph>
                    <Divider />
                    <div className="d-md-flex justify-content-between align-items-center">
                        <span className="text-muted">From: <strong>{newsletter?.author}</strong></span>
                        <span>{toHumanDate(newsletter?.date_created)}</span>
                    </div>
                </Card>
            </div>
        </>
    )
}

export default NewsletterDetail;