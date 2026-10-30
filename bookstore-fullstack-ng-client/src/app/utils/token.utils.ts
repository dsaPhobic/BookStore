import { jwtDecode } from "jwt-decode";
import { User } from "../account/data/user.model";

export const tokenKey = "access-token";

const getToken = () => localStorage.getItem(tokenKey);

const getUserFromToken = (token: string): User | null => {
  try {
    const decodedToken: any = jwtDecode(token);
    const { role, unique_name } = decodedToken;
    const user: User = { roles: role, username: unique_name };
    return user;
  } catch (ex) {
    console.log(ex);
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
