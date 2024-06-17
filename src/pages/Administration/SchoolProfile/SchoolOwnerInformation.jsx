import { Card, Form, Input } from "antd";
import authenticationService from "../../../services/authentication.service";
import institutionService from "../../../services/institution.service";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
export async function schoolProfileLoader() {
  try {
    const id = authenticationService.getUserTenantId();
    const response = await institutionService.getByTenantId(id);
    if (response?.status === 200) {
      const school = response.data;
      return { school };
    }
  } catch (e) {
    return [];
  }
}

const SchoolOwnerInformation = () => {
  const { school } = useLoaderData();
  const [country, setCountry] = useState("ZIMBABWE");

  return (
    <Form layout={"vertical"}>
      <div className="row">
        <div className="col-md-6">
          <Card hoverable>
            <Form.Item label="School name">
              <Input value={school?.institutionOwner?.name} size={"large"} />
            </Form.Item>
            <Form.Item label="Phone number">
              <Input
                value={school?.institutionOwner?.phoneNumber}
                size={"large"}
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input value={school?.institutionOwner?.address} size={"large"} />
            </Form.Item>
          </Card>
        </div>
        <div className="col-md-6">
          <Card>
            <Form.Item label="Website">
              <Input value={school?.institutionOwner?.website} size={"large"} />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={school?.institutionOwner?.email} size={"large"} />
            </Form.Item>
            <Form.Item label="Nation">
              <Input value={country} size={"large"} />
            </Form.Item>
          </Card>
        </div>
      </div>
    </Form>
  );
};

export default SchoolOwnerInformation;
