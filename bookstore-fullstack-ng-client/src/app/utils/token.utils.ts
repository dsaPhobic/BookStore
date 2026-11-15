import { jwtDecode } from "jwt-decode";
import { User } from "../account/data/user.model";

export const tokenKey = "access-token";

const getToken = () => localStorage.getItem(tokenKey);

const getUserFromToken = (token: string): User | null => {
  try {
    const decodedToken: any = jwtDecode(token);
    if (!decodedToken) return null;

    const username =
      decodedToken.unique_name ||
      decodedToken.name ||
      decodedToken.email ||
      decodedToken.sub ||
      decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      "";

    const role =
      decodedToken.role ||
      decodedToken.roles ||
      decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      [];

    const user: User = { roles: role, username };
    return user;
  } catch (ex) {
    console.error("Failed to decode token:", ex);
    return null;
  }
};

const isTokenExpired = (token: string) => {
  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; //convert to seconds;
    return decodedToken.exp < currentTime;
  } catch (ex) {
    console.log(ex);
    return true;
  }
};

export const tokenUtils = { getToken, isTokenExpired, getUserFromToken };
