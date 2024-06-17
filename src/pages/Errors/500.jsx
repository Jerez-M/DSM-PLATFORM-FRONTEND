import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";

const InternalServerErrorPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Result
                status="500"
                title="500"
                subTitle="Sorry, something went wrong."
                extra={<Button onClick={() => navigate('/')} type="primary">Back Home</Button>}
            />
        </>
    )
}

export default InternalServerErrorPage;