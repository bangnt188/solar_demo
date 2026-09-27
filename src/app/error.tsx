"use client";
export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="section container"><h1>Nội dung tạm thời chưa sẵn sàng</h1><p>Vui lòng thử lại sau ít phút.</p><button className="button" onClick={reset}>Thử lại</button></main>;
}
