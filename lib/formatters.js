// short UUID (last 6 characters)
export function formatId(id) {
	return id.substring(id.length - 6);
}

// Format date and times
export const formatDateTime = (dateString) => {
	const dateTimeOptions = {
		month: "short",
		year: "numeric",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	const dateOptions = {
		weekday: "short",
		month: "short",
		year: "numeric",
		day: "numeric",
	};
	const timeOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};

	const formattedDateTime = new Date(dateString).toLocaleString(
		"en-US",
		dateTimeOptions
	);
	const formattedDate = new Date(dateString).toLocaleString(
		"en-US",
		dateOptions
	);
	const formattedTime = new Date(dateString).toLocaleString(
		"en-US",
		timeOptions
	);

	return {
		dateTime: formattedDateTime,
		dateOnly: formattedDate,
		timeOnly: formattedTime,
	};
};
