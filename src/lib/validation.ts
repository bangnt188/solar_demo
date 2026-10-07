import { z } from "zod";

export const requiredString = (message = "Trường này là bắt buộc.") => z.string().trim().min(1, message);
export const email = (message = "Email không hợp lệ.") => z.email(message);
export const phone = (message = "Số điện thoại không hợp lệ.") => z.string().trim().regex(/^\+?[\d\s().-]{7,32}$/, message).refine(value => value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15, message);
export const optionalEmail = (message?: string) => z.union([z.literal(""), email(message)]);
export const url = (message = "Đường dẫn không hợp lệ.") => z.url({ protocol: /^https?$/, message });
export const numeric = (message = "Vui lòng nhập số hợp lệ.") => z.string().trim().min(1, message).refine(value => Number.isFinite(Number(value)), message);
export const integer = (message = "Vui lòng nhập số nguyên.") => z.string().trim().regex(/^-?\d+$/, message);
export const stringLength = (min: number, max: number, message = "Độ dài không hợp lệ.") => z.string().min(min, message).max(max, message);
export const date = (message = "Ngày không hợp lệ.") => z.iso.date(message);
export const optionalDate = (message?: string) => z.union([z.literal(""), date(message)]);
export const minDate = (minimum: string, message = `Ngày phải từ ${minimum} trở đi.`) => date().refine(value => value >= minimum, message);
export const maxDate = (maximum: string, message = `Ngày phải trước hoặc bằng ${maximum}.`) => date().refine(value => value <= maximum, message);
export const validate = <T,>(schema: z.ZodType<T>, value: unknown) => schema.safeParse(value);
