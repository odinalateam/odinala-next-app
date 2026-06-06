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
            height={34}
            width={100}
            alt="Afrova"
          />
        </Link>
        {children}
      </div>
    </div>
  );
}
