import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-foreground text-background ">
      <div className="max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/brand/logo.png"
                height={24}
                width={24}
                alt=""
                className="invert dark:invert-0"
              />
              <span className="font-bold text-lg">odinala</span>
            </Link>
            <p className="mt-3 text-sm text-background/60 leading-relaxed">
              Your trusted platform for properties and land across South-East
              Nigeria. Find your perfect home or investment.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <Link
                  href="/about"
                  className="hover:text-background transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-background transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-background transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Listings */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Listings</h3>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <Link
                  href="/"
                  className="hover:text-background transition-colors"
                >
                  All Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-background transition-colors"
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-background transition-colors"
                >
                  Lands
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-background/60">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-background transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-background transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-background transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="max-w-6xl mx-auto w-full px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-background/50">
          <p>&copy; {new Date().getFullYear()} Odinala. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-background transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-background transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
