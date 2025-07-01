import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { prisma } from "../server";
import { v4 as uuidv4 } from "uuid";

function generateToken(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "60m" }
  );
  const refreshToken = uuidv4();
  return { accessToken, refreshToken };
}

async function setToken(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none" /* strick if on same site */,
    secure: true,
    maxAge: 60 * 60 * 1000,
    domain: ".paperlampshade.com",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: ".paperlampshade.com",
  });
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: "User with email already Exists",
      });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newlyCreatedUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
        role: "USER",
      },
    });
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      userId: newlyCreatedUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const extractCurrentUser = await prisma.user.findUnique({
      where: { email },
    });

    if (
      !extractCurrentUser ||
      !(await bcrypt.compare(password, extractCurrentUser.password))
    ) {
      res.status(401).json({
        success: false,
        error: "User with Email Address Not Found and invalid credential",
      });
      return;
    }
    const { accessToken, refreshToken } = generateToken(
      extractCurrentUser.id,
      extractCurrentUser.email,
      extractCurrentUser.role
    );
    await prisma.user.update({
      where: { id: extractCurrentUser.id },
      data: { refreshToken },
    });
    await setToken(res, accessToken, refreshToken);
    res.status(201).json({
      success: true,
      message: "Login Successful",
      user: {
        id: extractCurrentUser.id,
        email: extractCurrentUser.email,
        name: extractCurrentUser.name,
        role: extractCurrentUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Unable to Login ! Please try again Later",
    });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: "Invalid refresh Token",
    });
    return;
  }
  try {
    const user = await prisma.user.findFirst({
      where: { refreshToken: refreshToken },
    });
    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not Found",
      });
      return;
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id,
      user.email,
      user.role
    );
    await setToken(res, accessToken, newRefreshToken);
    res.status(201).json({
      success: true,
      message: "Refresh token Refreshed Successfully",
    });
  } catch (error) {
    console.error;
    res.status(500).json({
      success: false,
      error: "unable to refesh Access Token",
    });
  }
};

export const logOut = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshAccessToken;
  if (refreshToken) {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    });
  }
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".paperlampshade.com",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    domain: ".paperlampshade.com",
    path: "/",
  });
  res.json({
    success: true,
    message: "Logout Successfully",
  });
};
