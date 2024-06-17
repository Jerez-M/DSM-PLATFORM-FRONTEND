import { useLoaderData } from "react-router-dom";
import {Avatar, Button, Divider, Tabs} from "antd";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import ChangePasswordForm from "../../../common/ChangePasswordForm";
import AuthenticationService from "../../../services/authentication.service";
import institutionService from "../../../services/institution.service";
import SchoolDetails from "./SchoolDetails/SchoolDetails";
import SchoolBankInformation from "./BankInformation/SchoolBankInformation";
import SchoolOwnerInformation from "./SchoolOwnerInformation";

export async function schoolProfileLoader() {
  try {
    const id = AuthenticationService.getUserTenantId();
    const response = await institutionService.getByTenantId(id);
    if (response?.status === 200) {
      const school = response.data;
      return { school };
    }
  } catch (e) {
    return [];
  }
}
const SchoolProfile = () => {
  const { school } = useLoaderData();
  const [changePasswordBtnModal, setChangePasswordBtnModal] = useState(false);

  const tabItems = [
    {
      key: '1',
      label: <Button type={"default"} className='border-0 mx-1'>School Details</Button>,
      children: <SchoolDetails school={school} />
    },
    {
      key: '2',
      label: <Button type={"default"} className='border-0'>Bank Information</Button>,
      children: <SchoolBankInformation />
    },
    {
      key: '3',
      label: <Button type={"default"} className='border-0'>School Owner</Button>,
      children: <SchoolOwnerInformation />
    }
  ];

  const onChange = (key) => {
    console.log({key});
  };

  return (
    <div className={"overflow-x-hidden"}>
      <div className="d-flex justify-content-between align-items-center">
        <h3>School Profile</h3>
        <Button
          icon={<EditOutlined />}
          onClick={() => setChangePasswordBtnModal(true)}
          danger={true}
          type={"primary"}
        >
          Change password
        </Button>
      </div>
      <Divider type={"horizontal"} />

      {school?.logo && (
        <div className="text-center">
          <Avatar
            size={200}
            src={school?.logo}
            alt="School Logo"
            style={{ marginBottom: "16px" }}
          />
        </div>
      )}

      <div className='container-fluid p-0'>
        <Tabs
            defaultActiveKey="1"
            items={tabItems}
            onChange={onChange}
            style={{color: '#39b54a'}}
        />
      </div>

      <ChangePasswordForm
        open={changePasswordBtnModal}
        close={() => setChangePasswordBtnModal(false)}
      />
    </div>
  );
};

export default SchoolProfile;
