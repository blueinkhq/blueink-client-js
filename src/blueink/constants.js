const BLUEINK_PAGINATION_HEADER = 'x-blueink-pagination';
const DEFAULT_BASE_URL = 'https://api.blueink.com/api/v2';

const ATTACHMENT_TYPE = {
	JPG: 'jpg',
	JPEG: 'jpeg',
	PNG: 'png',
	GIF: 'gif',
	SVG: 'svg',
	PDF: 'pdf',
	DOC: 'doc',
	DOCX: 'docx',
	PPT: 'ppt',
	PPTX: 'pptx',
	XLS: 'xls',
	XLSX: 'xlsx',
	RTF: 'rtf',
	TXT: 'txt',
};

const BUNDLE_ORDER = {
	CREATED: 'created',
	SENT: 'sent',
	COMPLETED_AT: 'completed_at',
};

const BUNDLE_STATUS = {
	NEW: 'ne',
	DRAFT: 'dr',
	PENDING: 'pe',
	SENT: 'se',
	STARTED: 'st',
	CANCELLED: 'ca',
	EXPIRED: 'ex',
	COMPLETE: 'co',
	FAILED: 'fa',
};

const DELIVER_VIA = {
	EMAIL: 'em',
	SMS: 'sm',
	KIOSK: 'ki',
	BOTH: 'bo',
};

const FIELD_KIND = {
	ESIGNATURE: 'sig',
	INITIALS: 'ini',
	SIGNERNAME: 'snm',
	SIGNINGDATE: 'sdt',
	INPUT: 'inp',
	TEXT: 'txt',
	DATE: 'dat',
	CHECKBOX: 'chk',
	CHECKBOXES: 'cbx',
	ATTACHMENT: 'att',
};

const PACKET_STATUS = {
	NEW: 'ne',
	READY: 're',
	SENT: 'se',
	STARTED: 'st',
	CANCELLED: 'ca',
	EXPIRED: 'ex',
	COMPLETE: 'co',
	FAILED: 'fa',
};

const V_PATTERN = {
	EMAIL: 'email',
	BANK_ROUTING: 'bank_routing',
	BANK_ACCOUNT: 'bank_account',
	LETTERS: 'letters',
	NUMBERS: 'numbers',
	PHONE: 'phone',
	SSN: 'ssn',
	ZIP_CODE: 'zip_code',
};

const BLUEINK_PATH = {
	BUNDLES: '/bundles',
	PERSONS: '/persons',
	PACKETS: '/packets',
	TEMPLATES: '/templates',
	WEBHOOKS: '/webhooks',
}

const WEBHOOKS = {
	HEADERS: 'headers',
	EVENTS: 'events',
	DELIVERIES: 'deliveries',
	SECRET: 'secret',
}

module.exports = {
	ATTACHMENT_TYPE,
	BLUEINK_PAGINATION_HEADER,
	BLUEINK_PATH,
	BUNDLE_ORDER,
	DEFAULT_BASE_URL,
	V_PATTERN,
	WEBHOOKS,
    BUNDLE_STATUS,
    DELIVER_VIA,
    FIELD_KIND,
    PACKET_STATUS,
};
