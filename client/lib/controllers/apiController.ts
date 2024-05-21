import {
  CreateUserParams,
  LeaderBoardPlayerItem,
  LogInUserParams,
  Player,
  UserParams,
} from "@/lib/types";
import { handleError } from "../utils/utils";
import axios from "axios";
import { getToken } from "../utils/authUtils";

export async function loginUser( values: any, onSuccess: (data: UserParams) => void, onError: (error: any) => void ) {
  try {
    //testWaiter();

    const response = await axios.post( `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, values );

    onSuccess(response.data);
  } catch (error: any) {
    if (error.response) {
      onError(error);
    } else {
      handleError(error);
    }
  }
}

export async function createUser( values: any, onSuccess: (data: UserParams) => void, onError: (error: any) => void ) {
  try {
    const response = await axios.post( `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, values );

    onSuccess(response.data);
  } catch (error: any) {
    if (error.response) {
      onError(error);
    } else {
      handleError(error);
    }
  }
}

export const getMyPlayer = async (nickname: string): Promise<Player | null> => {
  try {
    console.log("Fetching user data:", nickname);

    // Cookie'den access_token'ı al
    const token = getToken();

    if (!token) { throw new Error("No access token found"); }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/find/${nickname}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          // Cookie başlığını manuel olarak eklemek gerekli değil
          // Authorization: `Bearer ${accessToken}`, // Eğer token'ı Authorization başlığı olarak eklemek istiyorsanız
        },
        // withCredentials: true // Cookie'leri dahil etmek için bu satırı ekleyin
      }
    );

    if (!response) {
      throw new Error("No response");
    }
    const data: Player = response.data;
    data.token = token;

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; // Hata durumunda null döner
  }
};

export const getLeaderBoard = async (): Promise<LeaderBoardPlayerItem[] | null> => {
  try {
    // Cookie'den access_token'ı al
    const token = getToken();

    if (!token) { throw new Error("No access token found"); }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/leaderboard`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // Cookie başlığını manuel olarak eklemek gerekli değil
        // Authorization: `Bearer ${accessToken}`, // Eğer token'ı Authorization başlığı olarak eklemek istiyorsanız
      },
      // withCredentials: true // Cookie'leri dahil etmek için bu satırı ekleyin
    });

    if (!response) { throw new Error("No response"); }

    const data: LeaderBoardPlayerItem[] = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return null;
  }
};

export async function testWaiter() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
