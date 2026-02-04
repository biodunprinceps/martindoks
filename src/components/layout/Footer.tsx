import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Martin Doks Homes</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A beacon of innovation and excellence in Nigeria's construction landscape, 
              delivering reliable solutions with over a decade of expertise.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="https://web.facebook.com/people/Martin-Doks-Homes/61559460314565/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/martindoks_homes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/martin-doks-homes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/martindokshomes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-muted-foreground hover:text-primary">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-muted-foreground hover:text-primary">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground hover:text-primary">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-primary">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/brand-associates" className="text-muted-foreground hover:text-primary">
                  Brand Associates
                </Link>
              </li>
              <li>
                <Link href="/virtual-tour" className="text-muted-foreground hover:text-primary">
                  Virtual Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                <span className="break-words">Block V, Plot 2 Land Bridge Ave. Abila Abiodun Oniru Rd, Lagos</span>
              </li>
              <li className="flex items-start space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 sm:mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="break-all">+2349139694471</div>
                  <div className="break-all">+2349159162025</div>
                </div>
              </li>
              <li className="flex items-start sm:items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 sm:mt-0 flex-shrink-0" />
                <span className="break-all">info@martindokshomes.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {currentYear} Martin Doks Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

