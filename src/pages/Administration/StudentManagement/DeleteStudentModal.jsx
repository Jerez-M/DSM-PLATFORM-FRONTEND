import { Modal, message } from "antd";
import { useState } from "react";
import {DeleteOutlined, WarningOutlined} from "@ant-design/icons";
import StudentService from "../../../services/student.service";
import {handleError} from "../../../common";
import {useNavigate} from "react-router-dom";

const DeleteStudentModal = ({ open, close, userId, fullname}) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            setLoading(true);
            setDisabled(true);

            const response = await StudentService.delete(userId);

            if (response.status === 204) {
                setLoading(false);
                setDisabled(false);
                await message.success("Student Deleted Successfully");
                navigate("/admin/students");
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

    // console.clear()
    return (
        <>
            <Modal
                title="Delete Student"
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
                }}
            >
                <p className="text-center mt-4"><WarningOutlined style={{ fontSize: 72, color: "red"}} /></p>
                <h4 className="text-center my-3">Are you sure you want to delete {fullname}?</h4>
                <p className="text-center">
                    This action cannot be undone. It will permanently delete <strong>{fullname}</strong> from the database.
                </p>
                <p className="text-center">To escape close modal</p>

            </Modal>
        </>
    );
};

export default DeleteStudentModal;
