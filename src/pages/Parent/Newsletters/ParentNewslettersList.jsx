import {Card, Divider, List, Typography} from "antd";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import AuthenticationService from "../../../services/authentication.service";
import {fallbackImg, toHumanDate} from "../../../common";
import NewsletterService from "../../../services/newsletter.service";

export async function parentsNewslettersLoader() {
    try {
        const newslettersResponse = await NewsletterService.getAllByAudience(AuthenticationService.getUserTenantId(), "parents");
        return {newsletters: newslettersResponse.data};
    } catch (e) {
        console.log(e);
    }
}

const ParentsNewsletterList = () => {
    const { newsletters } = useLoaderData();
    const navigate = useNavigate();

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Newsletter</h3>
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
                        <Card
                            hoverable={true}
                            onClick={() => navigate(`${item.id}`)}
                            style={{ minHeight: 392 }}
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
                            <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: "more"}} className="mt-2">
                                <div dangerouslySetInnerHTML={{ __html: item.body }} />
                            </Typography.Paragraph>
                            <div className="d-md-flex justify-content-between align-items-center">
                                <span className="text-muted">From: <strong>{item.author}</strong></span>
                                <span>{toHumanDate(item.date_created)}</span>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default ParentsNewsletterList;