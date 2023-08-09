import * as z from 'zod';

export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3).max(30),
    username: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000),
})

export const LoginValidation = z.object({
    email: z.string().email("Invalid email format").min(6),
    password: z.string().min(8),
})

export const RegisterValidation = z.object({
    email: z.string().email("Invalid email format").min(6),
    username: z.string().min(3).max(20),
    name: z.string().min(2).max(50),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });