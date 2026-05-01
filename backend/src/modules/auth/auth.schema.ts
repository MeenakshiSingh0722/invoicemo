import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const loginSchema = registerSchema;

export const refreshSchema = z.object({
  body: z.object({}).optional()
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(32),
    password: z.string().min(8)
  })
});

export const verifyEmailParamSchema = z.object({
  params: z.object({
    token: z.string().min(32)
  })
});
