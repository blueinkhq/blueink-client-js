export const DEFAULT_BASE_URL = "https://api.blueink.com/api/v2";

export const ATTACHMENT_TYPE = {
    JPG: "jpg",
    JPEG: "jpeg",
    PNG: "png",
    GIF: "gif",
    SVG: "svg",
    PDF: "pdf",
    DOC: "doc",
    DOCX: "docx",
    PPT: "ppt",
    PPTX: "pptx",
    XLS: "xls",
    XLSX: "xlsx",
    RTF: "rtf",
    TXT: "txt",
};

export const BUNDLE_ORDER = {
    CREATED: "created",
    SENT: "sent",
    COMPLETED_AT: "completed_at",
};

export const BUNDLE_STATUS = {
    NEW: "ne",
    DRAFT: "dr",
    PENDING: "pe",
    SENT: "se",
    STARTED: "st",
    CANCELLED: "ca",
    EXPIRED: "ex",
    COMPLETE: "co",
    FAILED: "fa",
};

export const DELIVER_VIA = {
    EMAIL: "em",
    SMS: "sm",
    KIOSK: "ki",
    BOTH: "bo",
};

export const FIELD_KIND = {
    ESIGNATURE: "sig",
    INITIALS: "ini",
    SIGNERNAME: "snm",
    SIGNINGDATE: "sdt",
    INPUT: "inp",
    TEXT: "txt",
    DATE: "dat",
    CHECKBOX: "chk",
    CHECKBOXES: "cbx",
    ATTACHMENT: "att",
};

export const PACKET_STATUS = {
    NEW: "ne",
    READY: "re",
    SENT: "se",
    STARTED: "st",
    CANCELLED: "ca",
    EXPIRED: "ex",
    COMPLETE: "co",
    FAILED: "fa",
};

export const V_PATTERN = {
    EMAIL: "email",
    BANK_ROUTING: "bank_routing",
    BANK_ACCOUNT: "bank_account",
    LETTERS: "letters",
    NUMBERS: "numbers",
    PHONE: "phone",
    SSN: "ssn",
    ZIP_CODE: "zip_code",
};