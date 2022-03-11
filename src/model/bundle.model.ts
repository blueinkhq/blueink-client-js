
interface Packet {
    name: string,
    email: string,
    phone: string,
    auth_sms: boolean,
    auth_selfie: boolean,
    auth_id: boolean,
    key: string,
    person_id: string,
    deliver_via: string,
    order: number,
}

interface Field {
    kind: string,
    key: string,
    label: string,
    page: number,
    x: number,
    w: number,
    h: number,
    v_pattern: string,
    v_min: number,
    v_max: number,
    editors: string[],
}

interface Document {
    key: string,
    file_url: string,
    file_index: string,
    fields: Field[],
    parse_tags: boolean,
}

interface Bundle {
    label: string,
    in_order: boolean,
    email_subject: string,
    email_message: string,
    sms_message: string,
    requester_name: string,
    requester_email: string,
    cc_emails: string[],
    custom_key: string,
    team: string,
    is_test: boolean,
    packets: Packet[],
    documents: Document[],
}

export const initBundle: Bundle = {
    label: '',
    in_order: false,
    email_subject: '',
    email_message: '',
    sms_message: '',
    requester_name: '',
    requester_email: '',
    cc_emails: [],
    custom_key: '',
    team: '',
    is_test: true,
    packets: [],
    documents: [],
}

// module.exports = initBundle

