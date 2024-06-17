import {useState} from "react";
import {useNavigate} from "react-router-dom";
import StudentService from "../../../../../services/student.service";
import {message, Modal} from "antd";
import {handleError, refreshPage} from "../../../../../common";
import {DeleteOutlined, WarningOutlined} from "@ant-design/icons";

const ConfirmDeleteStudentsModal = ({ open, close, userIds}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleDelete = async () => {
        try {
            setLoading(true);
            setDisabled(true);

            const response = await StudentService.bulkDelete(userIds);

            if (response.status === 204) {
                setLoading(false);
                setDisabled(false);
                await message.success("Students Deleted Successfully");
                refreshPage();
                close();
            } else {
                setLoading(false);
                setDisabled(false);
                message.error("An error occurred, please check your network.");
            }
        } catch (error) {
            console.log("Error occurred:", error);
            setLoading(false);
            setDisabled(false);
            handleError(error);
        }
    };

    return (
        <>
            <Modal
                title="Delete Students"
                open={open}
                onCancel={close}
                cancelButtonProps={{size: "large"}}
                onOk={handleDelete}
                okText={loading ? "Loading" : "Delete"}
                okButtonProps={{
                    icon: <DeleteOutlined/>,
                    danger: true,
                    title: "Delete Student",
                    size: "large",
                    disabled: disabled,
                    loading: loading
                }}
            >
                <p className="text-center mt-4"><WarningOutlined style={{ fontSize: 72, color: "red"}} /></p>
                <h4 className="text-center my-3">Are you sure you want to delete {userIds.length} students?</h4>
                <p className="text-center">
                    This action cannot be undone. It will permanently delete <strong>{userIds.length} students?</strong> from the database.
                </p>
                <p className="text-center">To escape close modal</p>

            </Modal>
        </>
    );
};

export default ConfirmDeleteStudentsModal;