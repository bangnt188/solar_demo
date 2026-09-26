import { MotionRuntime } from "@/components/motion/motion-runtime";

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}<MotionRuntime /></>;
}
