import Link from "next/link";
import Container from "../Container";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#0a2540] text-white text-base py-6 shadow-inner">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          {/* Copyright */}
          <p className="font-semibold select-none">
            © 2025 E-Anime. All rights reserved
          </p>

          {/* Social Links */}
          <div className="text-white">
            <p className="font-semibold mb-2 md:mb-0">Follow Us</p>
            <div className="flex items-center justify-evenly gap-3 text-xl mt-1">
              <Link
                href="https://web.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#3b5998] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook />
              </Link>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e4405f] transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}