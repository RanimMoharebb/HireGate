export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatExamWindowTime(value: string | null | undefined): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const datePart = date.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  let timePart = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  timePart = timePart.toLowerCase();
  timePart = timePart.replace(/:00\s*(am|pm)$/, " $1");

  return `${datePart} - ${timePart}`;
}
