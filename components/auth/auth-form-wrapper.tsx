import Image from "next/image";
import Link from "next/link";

interface AuthFormWrapperProps {
  children: React.ReactNode;
}

export function AuthFormWrapper({ children }: AuthFormWrapperProps) {
  return (
    <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-8 lg:py-12">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Image
            src="/brand/logo.png"
            height={28}
            width={28}
            alt="Odinala"
            className="dark:invert"
          />
          <span className="font-bold text-lg">odinala</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
