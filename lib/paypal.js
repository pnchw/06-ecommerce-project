const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const base = process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

// get access token
async function generateAccessToken() {
	const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
	const response = await fetch(`${base}/v1/oauth2/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${auth}`,
		},
		body: "grant_type=client_credentials",
		cache: "no-store",
	});

	if (!response.ok) {
		const errorData = await response.text();
		throw new Error(
			`Failed to get access token: ${errorData} ${response.status}`
		);
	}

	const jsonData = await response.json();
	return jsonData.access_token;
}

async function handleResponse(response) {
	if (response.ok) {
		return response.json();
	} else {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}
}

// API หลัก
export const paypal = {
	// สร้าง Order
	async createOrder(price, currencyCode = "USD") {
		const accessToken = await generateAccessToken();
		const value = Number(price).toFixed(2);

		const response = await fetch(`${base}/v2/checkout/orders`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				intent: "CAPTURE",
				purchase_units: [
					{
						amount: {
							currency_code: currencyCode,
							value,
						},
					},
				],
			}),
		});
		return handleResponse(response);
	},

	async createPayment(orderPaymentId) {
		const accessToken = await generateAccessToken();
		const response = await fetch(
			`${base}/v2/checkout/orders/${orderPaymentId}/capture`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);
		return handleResponse(response);
	},
};
