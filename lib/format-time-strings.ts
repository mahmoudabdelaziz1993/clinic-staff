export function formatTimeIntl(timeStr: string) {
    const [h, m] = timeStr.split(":");
    const date = new Date();
    date.setHours(Number(h), Number(m), 0);

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(date);
}