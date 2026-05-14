export function validateEmailForm(data: {
  to: string;
  subject: string;
  message: string;
}) {
  const errors: string[] = [];

  if (!data.to.trim()) errors.push("Recipient email is required.");
  if (!data.subject.trim()) errors.push("Subject is required.");
  if (!data.message.trim()) errors.push("Message is required.");

  if (data.to && !data.to.includes("@")) {
    errors.push("Invalid email format.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}