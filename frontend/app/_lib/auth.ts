export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// decode JWT 
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      userId: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    };
  } catch {
    return null;
  }
}

