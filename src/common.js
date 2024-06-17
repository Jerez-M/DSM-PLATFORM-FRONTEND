import AuthenticationService from "./services/authentication.service";
import InstitutionService from "./services/institution.service";
import {useEffect, useState} from "react";
import {Button, Form, Input, message, Select, Space} from "antd";
import {format, formatDistance, intervalToDuration} from "date-fns";
import COUNTRY_CODES from "./utils/countrycodes";
import {SearchOutlined} from "@ant-design/icons";

export const InstitutionName = ({textColor}) => {
    const [name, setName] = useState('');

    async function fetchInstitutionName() {
        try {
            const tenantId = AuthenticationService.getUserTenantId();
            const response = await InstitutionService.get(tenantId);
            if (response?.status === 200) {
                setName(response.data.institution_name);
            }
        } catch (e) {
            setName('');
        }
    }

    useEffect(
        () => {
            fetchInstitutionName();
        }, []
    )
    return (
        <h5 className={`${textColor} ms-3 d-none d-md-block`}>{name}</h5>
    )
}

export const InstitutionLogo = () => {
    const institutionId = AuthenticationService.getUserTenantId();
    const [logoUrl, setLogoUrl] = useState('');

    const fetchInstitutionLogo = async () => {
        try {
            const response = await InstitutionService.getLogoByTenantId(institutionId);
            if (response?.status === 200) {
                const logo = response.data.url;
                setLogoUrl(logo);
            }
        } catch (e) {

        }
    }

    useEffect(
        () => {
            fetchInstitutionLogo();
        }, []
    )
    return (
        <img id='image' src={logoUrl} alt='Logo' height='50' width='50' />
    )
}

export const refreshPage = () => {
    setTimeout(()=>{
        window.location.reload();
    }, 500);
}

export const _COUNTRY_CODES = COUNTRY_CODES.map(({code, name}) => ({
    label: `${code} ${name}`,
    value: code,
}))

export const phoneNumberPrefix = (
    <Form.Item name="countryCode" initialValue={"+263"} noStyle>
        <Select
            style={{ minWidth: 100 }}
            options={_COUNTRY_CODES}
        >
        </Select>
    </Form.Item>
);

export const _CURRENCY_CODES = [
    {value: "USD", label: "USD $"},
    {value: "ZiG", label: "ZiG $"},
    {value: "EUR", label: "EUR €"},
    {value: "GBP", label: "GBP £"},
    {value: "CNY", label: "CNY ¥"},
    {value: "JPY", label: "JPY ¥"},
    {value: "AUD", label: "AUD $"},
    {value: "CAD", label: "CAD $"},
    {value: "INR", label: "INR ₹"},
    {value: "BRL", label: "BRL R$"},
    {value: "ARS", label: "ARS $"},
    {value: "MXN", label: "MXN $"},
    {value: "NZD", label: "NZD $"},
    {value: "CHF", label: "CHF Fr"},
    {value: "SEK", label: "SEK kr"},
    {value: "NOK", label: "NOK kr"},
    {value: "DKK", label: "DKK kr"},
    {value: "RUB", label: "RUB ₽"},
    {value: "TRY", label: "TRY ₺"},
    {value: "AED", label: "AED د.إ"},
    {value: "SAR", label: "SAR ﷼"},
    {value: "HKD", label: "HKD $"},
    {value: "SGD", label: "SGD $"},
    {value: "MYR", label: "MYR RM"},
    {value: "PHP", label: "PHP ₱"},
    {value: "THB", label: "THB ฿"},
    {value: "IDR", label: "IDR Rp"},
    {value: "PKR", label: "PKR ₨"},
    {value: "KRW", label: "KRW ₩"},
    {value: "ILS", label: "ILS ₪"},
    {value: "PLN", label: "PLN zł"},
    {value: "HUF", label: "HUF Ft"},
    {value: "CZK", label: "CZK Kč"},
    {value: "BGN", label: "BGN лв"},
    {value: "RON", label: "RON lei"},
    {value: "HRK", label: "HRK kn"},
    {value: "ISK", label: "ISK kr"},
    {value: "CLP", label: "CLP $"},
    {value: "BHD", label: "BHD .د.ب"},
    {value: "EGP", label: "EGP £"},
    {value: "KWD", label: "KWD د.ك"},
    {value: "OMR", label: "OMR ﷼"},
    {value: "QAR", label: "QAR ﷼"},
    {value: "LKR", label: "LKR Rs"},
    {value: "MAD", label: "MAD د.م."},
    {value: "TWD", label: "TWD $"},
    {value: "TND", label: "TND د.ت"},
    {value: "DZD", label: "DZD د.ج"},
    {value: "JOD", label: "JOD د.ا"},
    {value: "MVR", label: "MVR ރ."},
    {value: "BND", label: "BND $"},
    {value: "BWP", label: "BWP P"},
    {value: "BYN", label: "BYN Br"},
    {value: "BZD", label: "BZD $"},
    {value: "CDF", label: "CDF Fr"},
    {value: "CRC", label: "CRC ₡"},
    {value: "DOP", label: "DOP $"},
    {value: "ETB", label: "ETB Br"},
    {value: "FJD", label: "FJD $"},
    {value: "GEL", label: "GEL ₾"},
    {value: "GHS", label: "GHS ₵"},
    {value: "GNF", label: "GNF Fr"},
    {value: "GTQ", label: "GTQ Q"},
]

export const currencyPrefix = (
    <Form.Item name="currency" initialValue={"USD"} noStyle>
        <Select
            style={{ minWidth: 60 }}
            options={_CURRENCY_CODES}
        />
    </Form.Item>
);

export const getColumnSearchPropsNoFilter = (dataIndex, ref, handleSearch, handleReset) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
                ref={ref}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </Space>
        </div>
    ),
    filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilterDropdownOpenChange: (visible) => {
        if (visible) {
            setTimeout(() => ref.current?.select(), 100);
        }
    }
});

export const getColumnSearchProps = (dataIndex, ref, handleSearch, handleReset) => ({
    ...getColumnSearchPropsNoFilter(dataIndex, ref, handleSearch, handleReset),
    onFilter: (value, record) =>
        record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value).toLowerCase()),
});

export const handleError = (e, defaultMessage) => {
    console.log({e})
    if(e?.response?.status === 400 && e.response.data) {
        const data = e.response.data;
        Object.keys(data).forEach(key => {
            const value = data[key][0];
            message.error(`${key}: ${value}`);
        });
    } else {
        message.error(e?.response?.data?.error || defaultMessage || "An error occurred. Please check your network connection.");
    }
};

export const handleListErrors = (e, defaultMessage) => {
    console.log({e})
    if(e?.response?.status === 400 && e.response.data) {
        const errors = e.response.data;
        errors.forEach(error => {
            message.error(`${error}`);
        });
    } else {
        message.error(e?.response?.data?.error || defaultMessage || "An error occurred. Please check your network connection.");
    }
};

export const handleSingleError = (e, defaultMessage) => {
    console.log({e})
    if(e?.response?.data?.error) {
            message.error(e?.response?.data?.error);
    } else {
        message.error(e?.response?.data?.error || defaultMessage || "An error occurred. Please check your network connection.");
    }
};

export const handleJerryError = (e, defaultMessage) => {
    console.log({e})
    if(e?.response?.data?.message) {
        message.error(e?.response?.data?.message);
    } else {
        message.error(e?.response?.data?.message || defaultMessage || "An error occurred. Please check your network connection.");
    }

    if(e?.response?.data?.error) {
        const data = e.response.data.error;
        Object.keys(data).forEach(key => {
            const value = data[key][0];
            message.error(`${normalizeEnumCase(key)}: ${value}`);
        });
    }

};

export const primaryColor = "#39b54a";
export const editColor = "#FAAD14";
export const deleteColor = "#d22323";
export const successColor = "#87d068";

export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export const normalizeEnumCase = s => {
    if(!s) return s;
    return capitalize(s.replaceAll("_", " "))
}

export const capitalize = s => {
    return (s && s[0].toUpperCase() + s.slice(1).toLowerCase()) || ""
}

export const toInputUppercase = e => {
    e.target.value = ("" + e.target.value).toUpperCase();
};

export const capitaliseFirstLetters = str => {
    if(!str) return "";
    str = str.toLowerCase();
    return str.replace(/(^\w{1})|(\s\w{1})/g, match => match.toUpperCase());
}

export const toHumanDate = (dateString) => {
    if(!dateString) return null
    return format(new Date(dateString), "dd LLL yyy")
}

export const toYear = (dateString) => {
    if(!dateString) return null
    return format(new Date(dateString), "yyy")
}

export const toDuration = (start, end) => {
    const { days, hours, minutes } = intervalToDuration({start, end});

    if(days > 0) {
        return `${days} days, ${hours} hours`
    }
    return `${hours} hours : ${minutes} minutes`;
};


export const toTimeAgo = (dateString) => {
    formatDistance(new Date(dateString), new Date(), {addSuffix: true, includeSeconds: true})
}

export const toHumanDateTime = (dateString) => {
    if(!dateString) return null
    return format(new Date(dateString), "dd LLL yyy;  hh:mm ")
}

export const getGoogleBooksImageUrlFromGoogleBookId = (googleBookId) => {
    return `http://books.google.com/books/content?id=${googleBookId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`
}

export const fallbackImg = "data:image/png;base64,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";

export const MONTHS = [
    {label: "January", value: "January"},
    {label: "February", value: "February"},
    {label: "March", value: "March"},
    {label: "April", value: "April"},
    {label: "May", value: "May"},
    {label: "June", value: "June"},
    {label: "July", value: "July"},
    {label: "August", value: "August"},
    {label: "September", value: "September"},
    {label: "October", value: "October"},
    {label: "November", value: "November"},
    {label: "December", value: "December"},
]


export function pluralize(number, word) {
    return number === 1 ? word : word + 's';
}