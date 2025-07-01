"use server";

import { protecctedLoginRules, protectedSignUpRules } from "@/arcjet";
import { request } from "@arcjet/next";

export const protectedSingupAction = async (email: string) => {
  const req = await request();

  const decision = await protectedSignUpRules.protect(req, { email });
  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE")) {
        return {
          error: "Disposable email address are not allowed",
          success: false,
          status: 403,
        };
      } else if (emailTypes.includes("INVALID")) {
        return {
          error: "Invalid Email",
          success: false,
          status: 403,
        };
      } else if (emailTypes.includes("NO_MX_RECORDS")) {
        return {
          error:
            "Email domain doesnot have valid max records! please try again",
        };
      }
    } else if (decision.reason.isBot()) {
      return {
        error: "Bot Activity detected",
        sucess: false,
        status: 403,
      };
    } else if (decision.reason.isRateLimit()) {
      return {
        error: "Too many request Please try again later",
        success: false,
        status: 403,
      };
    }
  }
  return {
    success: true,
  };
};

export const protectSignInAction = async (email: string) => {
  const req = await request();
  const decision = await protecctedLoginRules.protect(req, { email });

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      const emailTypes = decision.reason.emailTypes;
      if (emailTypes.includes("DISPOSABLE")) {
        return {
          error: "Disposable email address are not allowed",
          success: false,
          status: 403,
        };
      } else if (emailTypes.includes("INVALID")) {
        return {
          error: "Invalid email",
          success: false,
          status: 403,
        };
      } else if (emailTypes.includes("NO_MX_RECORDS")) {
        return {
          error: "Email does not have MX Records",
          success: false,
          status: 403,
        };
      }
    }
  } else if (decision.reason.isRateLimit()) {
    return {
      error: "Too many request! please try again later",
      success: false,
      satus: 403,
    };
  }
  return {
    success: true,
  };
};
