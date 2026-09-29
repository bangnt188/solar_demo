export const uiMessages = {
  vi: {
    required: "Trường này là bắt buộc.",
    invalid: "Giá trị không hợp lệ.",
    loading: "Đang tải…",
    empty: "Không có dữ liệu.",
    close: "Đóng",
    previous: "Trước",
    next: "Tiếp",
  },
  en: {
    required: "This field is required.",
    invalid: "The value is invalid.",
    loading: "Loading…",
    empty: "No data available.",
    close: "Close",
    previous: "Previous",
    next: "Next",
  },
} as const;

export type UiLocale = keyof typeof uiMessages;
export type UiMessages = (typeof uiMessages)[UiLocale];
