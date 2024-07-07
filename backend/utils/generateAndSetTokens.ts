import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import * as jose from "jose";
import { Types } from "mongoose";

const SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET);
const ALG = process.env.JWT_ALGORITHM || "HS256";

export const generateAndSetAccessToken = async (userId: Types.ObjectId, c: Context) => {
  const accessToken = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(SECRET);

  setCookie(c, "access_token", accessToken, {
    secure: Object.is(process.env.NODE_ENV, "production"),
    sameSite: "strict",
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
    maxAge: 1 * 60 * 60,
  });
};

export const generateAndSetRefreshToken = async (userId: Types.ObjectId, c: Context) => {
  const refreshToken = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime('15d')
    .sign(SECRET);

  setCookie(c, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: Object.is(process.env.NODE_ENV, "production"),
    sameSite: "strict",
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    maxAge: 15 * 24 * 60 * 60,
  });
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload.userId;
  } catch (err: any) {
    return null;
  }
};
