import {Card, Form, Input} from "antd";

const SchoolDetails = ({school}) => {

    return (
        <Form layout={"vertical"}>
            <div className="row">
                <div className="col-md-3">
                    <Card hoverable>
                        <Form.Item label="School name">
                            <Input value={school?.institution_name} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="School type">
                            <Input value={school?.institution_type} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="Ownership">
                            <Input value={school?.ownership} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="School owner">
                            <Input value={school?.institutionOwner.name} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="Status">
                            <Input value={school?.active} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="Email address">
                            <Input value={school?.email_address} size={"large"}/>
                        </Form.Item>
                        <Form.Item className="pb-1" label="Phone number">
                            <Input value={school?.phone_number} size={"large"}/>
                        </Form.Item>
                    </Card>
                </div>
                <div className="col-md-9">
                    <Card>
                        <Form.Item label="Address">
                            <Input value={school?.address} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="District">
                            <Input value={school?.district} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="Country">
                            <Input value={school?.country} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="Province">
                            <Input value={school?.province} size={"large"}/>
                        </Form.Item>
                        <Form.Item label="Mission">
                            <Input.TextArea value={school?.mission} size={"large"} autoSize={{minRows: 3, maxRows: 6}}/>
                        </Form.Item>
                        <Form.Item label="Vision">
                            <Input.TextArea value={school?.vision} size={"large"} autoSize={{minRows: 3, maxRows: 6}}/>
                        </Form.Item>
                    </Card>
                </div>
            </div>
        </Form>
    )
}

export default SchoolDetails;