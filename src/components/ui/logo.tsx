import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/dashboard" className="flex items-center">
      <Image 
        src="/images/logo.png" 
        alt="OOI Platform Logo" 
        width={140} 
        height={40} 
        className={className}
        priority
      />
    </Link>
  );
} 