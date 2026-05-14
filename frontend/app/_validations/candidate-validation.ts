export function validateCandidateEmail(email: string) {
  if (!email.trim()) {
    return "Email is required";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return "Invalid email format";
  }

  return "";
}


export function validateSearch(search: string) {
  if (search.length > 100) {
    return "Search too long";
  }

  return "";
}