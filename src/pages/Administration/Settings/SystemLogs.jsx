import {Button, Divider, Tag, Timeline} from "antd";
import AuditTrailService from "../../../services/audit-trail.service";
import AuthenticationService from "../../../services/authentication.service";
import {useLoaderData} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import {useRef} from "react";
import {PrinterOutlined} from "@ant-design/icons";


function colorPicker(operation) {
    switch (operation) {
        case 'CREATE':
            return 'green'
        case 'UPDATE':
            return '#5C5CFF'
        case 'DELETE':
            return 'red'
        default:
            return 'green'
    }
}

export async function auditTrailsByInstitutionLoader() {
    try {
        const response = await AuditTrailService.getAuditTrailsByInstitutionId(
            AuthenticationService.getUserTenantId()
        )
        const data = response.data
        return {data}
    } catch (error) {
        return {}
    }
}
const SystemLogs = () => {
    const {data} = useLoaderData();

    const timelineItems = data.map(
        item => ({
            color: colorPicker(item?.operation),
            children: (
                <>
                    <span className='small m-0'>
                        {item?.user?.firstName} {item?.user?.lastName} &nbsp;
                        <Tag color={"blue-inverse"}>{item?.user?.username}</Tag>
                    </span> -&nbsp;
                    <span className='small m-0'>{item?.action}</span> -&nbsp;
                    <span className='small m-0'>{new Date(item?.created_at).toLocaleDateString(
                        'en-GB',
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        }

                    )}</span>
                </>
            )
        })
    )

    const logs = useRef();

    const handlePrint = useReactToPrint({
        content: () => logs.current,
        documentTitle: `System logs - ${new Date().toLocaleDateString()}`,
    })

    return (
        <div>
            <div className='d-flex justify-content-between align-content-center'>
                <h3>System logs</h3>
                <Button
                    type={"primary"}
                    className='px-4'
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                >
                    Print logs
                </Button>
            </div>
            <Divider type={"horizontal"} />

            <div ref={logs} className='mt-5'>
                <Timeline
                    items={timelineItems}
                    mode={"alternate"}
                />
            </div>
        </div>
    )
}

export default SystemLogs