import {ArrowLeftOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className='border-0 text-dark bg-transparent shadow-none p-0 m-0'
        >Back</Button>
    )
}

export default BackButton;