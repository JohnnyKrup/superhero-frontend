/**
 * Checks if a user is authenticated by verifying the JWT token
 *
 * 1. Checks if token exists in localStorage
 * 2. Decodes the token payload (middle part of JWT) using base64
 * 3. Verifies if token has expired by comparing exp claim with current time
 *
 * JWT Structure: header.payload.signature
 * We only need payload for expiration check
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return false;

  try {
    // Split token into parts and get payload (part 1)
    // atob() decodes base64
    // JSON.parse converts the decoded string to an object
    const payload = JSON.parse(atob(token.split(".")[1]));

    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};
