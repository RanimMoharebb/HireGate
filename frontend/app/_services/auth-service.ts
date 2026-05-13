const API_URL = process.env.NEXT_PUBLIC_API_URL;

// LOGIN
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Login failed");

  return data;
}


// COMPLETE REGISTRATION
export async function completeRegistration(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/auth/complete-registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Registration failed");

  return result;
}

// FORGOT PASSWORD
export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await res.text();

  if (!res.ok) throw new Error(result || "Failed request");

  return result;
}

// RESET PASSWORD
export async function resetPassword(data: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.text();

  if (!res.ok) throw new Error(result || "Reset failed");

  return result;
}

// RESEND OTP
export async function resendOtp(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await res.text();

  if (!res.ok) {
    throw new Error(result || "Failed to resend OTP");
  }

  return result;
}

