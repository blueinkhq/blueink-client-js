const sampleBundle = {
	label: "",
	in_order: false,
	email_subject: "",
	email_message: "",
	requester_name: "",
	requester_email: "",
	cc_emails: [],
	is_test: true,
	packets: [
		// {
		// 	name: "Peter Gibbons",
		// 	email: "peter.gibbons@example.com",
		// 	phone: "505 555 1234",
		// 	auth_sms: true,
		// 	auth_selfie: true,
		// 	auth_id: false,
		// 	key: "signer-1",
		// 	deliver_via: "email",
		// },
	],
	documents: [
		// {
		// 	key: "w9",
		// 	file_url: "https://www.irs.gov/pub/irs-pdf/fw9.pdf",
		// 	fields: [
		// 		{
		// 			kind: "inp",
		// 			key: "inp-name",
		// 			label: "Your Name",
		// 			page: 1,
		// 			x: 15,
		// 			y: 60,
		// 			w: 20,
		// 			h: 3,
		// 			v_pattern: "email",
		// 			v_min: 2,
		// 			v_max: 30,
		// 			editors: ["signer-1"],
		// 		},
		// 		{
		// 			kind: "sig",
		// 			key: "sig-01",
		// 			label: "Your Signature",
		// 			page: 1,
		// 			x: 15,
		// 			y: 68,
		// 			w: 30,
		// 			h: 12,
		// 			v_pattern: "email",
		// 			v_min: 2,
		// 			v_max: 30,
		// 			editors: ["signer-1"],
		// 		},
		// 	],
		// },
	],
};

const sample2 = {
	label: "label here",
	in_order: false,
	email_subject: "eSignature Request",
	email_message:
		"Here are the TPS reports that need your signature. Let me know if you have any questions.",
	requester_name: "Bill Lumbergh",
	requester_email: "tps.reports@example.com",
	cc_emails: ["tom.smykowski@example.com"],
	is_test: true,
	packets: [
		{
			name: "Peter Gibbons",
			email: "peter.gibbons@example.com",
			phone: "505 555 1234",
			auth_sms: true,
			auth_selfie: true,
			auth_id: false,
			key: "signer-1",
			deliver_via: "email",
		},
	],
	documents: [
	],
};

// module.exports = { sampleBundle, sample2 };
export {sampleBundle, sample2}