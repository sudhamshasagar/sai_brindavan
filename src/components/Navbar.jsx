
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
  Calendar,
  Globe,
  Clock,
  MapPin,
  PhoneCall,
  ArrowRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", target: "home" },
  { label: "Services", target: "services" },
  { label: "Doctors", target: "doctors" },
  { label: "Blogs", target: "blogs" },
  { label: "FAQ", target: "faq" },
];

const LANGUAGES = [
  { code: "en", label: "English", sub: "EN" },
  { code: "kn", label: "ಕನ್ನಡ", sub: "KN" },
];

function Navbar() {
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("site-language") || "en";
    } catch {
      return "en";
    }
  });

  // --------------------------------------------------
  // Scroll state
  // --------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --------------------------------------------------
  // Close menus when route changes
  // --------------------------------------------------

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLanguageOpen(false);
  }, [location.pathname]);

  // --------------------------------------------------
  // Lock body scroll when mobile menu is open
  // --------------------------------------------------

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // --------------------------------------------------
  // Outside click + Escape
  // --------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsLanguageOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // --------------------------------------------------
  // Language
  // --------------------------------------------------

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsLanguageOpen(false);

    try {
      localStorage.setItem("site-language", code);
    } catch {
      // Ignore localStorage errors.
    }
  };

  const currentLangLabel =
    LANGUAGES.find((lang) => lang.code === language)
      ?.label || "English";

  // --------------------------------------------------
  // One-page section navigation
  // --------------------------------------------------

  const handleSectionNavigation = (target) => {
    setIsMobileMenuOpen(false);
    setIsLanguageOpen(false);

    // Home = top of page
    if (target === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );

      return;
    }

    const element = document.getElementById(target);

    if (!element) {
      console.warn(
        `Navbar: Section #${target} was not found.`
      );
      return;
    }

    // Total fixed navbar height:
    // announcement bar + main navbar
    const navbarOffset = 117;

    const elementPosition =
      element.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: Math.max(
        0,
        elementPosition - navbarOffset
      ),
      behavior: "smooth",
    });

    // Keep URL shareable without causing a React Router
    // page navigation.
    window.history.replaceState(
      null,
      "",
      `/#${target}`
    );
  };

  // --------------------------------------------------
  // Navbar
  // --------------------------------------------------

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">

        {/* ==================================================
            TOP ANNOUNCEMENT BAR
        ================================================== */}

        <div className="relative border-b border-white/10 bg-gradient-to-r from-[#142848] via-[#1a365d] to-[#122e44] text-xs text-white selection:bg-[#1f9b90] selection:text-white">

          <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LEFT */}

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 font-medium text-slate-200">
                <Clock
                  className="hidden h-3.5 w-3.5 text-[#f6ac42] sm:inline-block"
                  aria-hidden="true"
                />
                <span className="hidden text-slate-300 sm:inline">
                  Mon – Sat:
                </span>
                <span className="text-[11px] font-semibold tracking-tight text-white">
                  8:00 AM – 8:00 PM
                </span>
              </div>
              <span className="hidden h-3.5 w-px bg-white/20 md:inline-block" />

              <div className="hidden items-center gap-1.5 text-[11px] text-slate-300 transition-colors hover:text-white md:flex">
                <MapPin
                  className="h-3.5 w-3.5 text-[#f6ac42]"
                  aria-hidden="true"
                />

                <span>Sagara, Karnataka</span>
              </div>

            </div>

            {/* CENTER */}

            <div className="flex items-center">
              <div className="group relative flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-100 shadow-[0_0_12px_rgba(239,68,68,0.2)] transition-all hover:border-red-400 hover:bg-red-900/50">

                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>

                <span className="bg-gradient-to-r from-red-200 to-white bg-clip-text font-extrabold text-transparent">
                  24/7 Emergency
                </span>

              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2 sm:gap-4">

              <a
                href="tel:+916361069736"
                className="group flex items-center gap-2 rounded-md bg-white/5 px-2.5 py-1 text-slate-200 transition-all hover:bg-[#f6ac42]/15 hover:text-[#f6ac42]"
                title="Immediate Emergency Hotline"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f6ac42]/20 text-[#f6ac42] transition-transform group-hover:scale-110">
                  <PhoneCall
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                </div>

                <span className="hidden text-[11px] font-bold tracking-wider text-white group-hover:text-[#f6ac42] sm:inline">
                  +91 63610 69736
                </span>
              </a>

              <span className="h-3.5 w-px bg-white/20" />

              {/* Admin remains accessible but is not part
                  of the primary public navigation. */}

              <Link
                to="/admin"
                className="group flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <span>Admin</span>

                <ArrowRight
                  className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </Link>

            </div>

          </div>
        </div>

        {/* ==================================================
            MAIN NAVBAR
        ================================================== */}

        <div
          className={[
            "transition-all duration-300",
            isScrolled
              ? "border-b border-slate-200/80 bg-white/95 shadow-md backdrop-blur-xl"
              : "border-b border-slate-100 bg-white/95 backdrop-blur-md",
          ].join(" ")}
        >

          <nav
            className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
            aria-label="Main Navigation"
          >

            {/* BRAND */}

            <button
              type="button"
              onClick={() =>
                handleSectionNavigation("home")
              }
              className="group flex shrink-0 items-center gap-3 text-left transition-transform duration-200 active:scale-[0.98]"
              aria-label="Sai Brindavan Medical Center - Home"
            >
              <img
                src="/logo.jpg"
                alt="Sai Brindavan Medical Center Logo"
                className="h-10 w-10 rounded-xl object-contain shadow-xs ring-1 ring-slate-200/60 transition-opacity duration-200 group-hover:opacity-95 sm:h-12 sm:w-12"
                width="48"
                height="48"
              />

              <div className="flex flex-col justify-center leading-none">
                <span className="text-base font-black tracking-tight text-[#1a365d] md:text-lg lg:text-2xl">
                  Sai Brindavan
                </span>

                <span className="mt-1 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#1f9b90] md:text-[10px]">
                  <span className="h-px w-4 bg-[#1f9b90]/60" />
                  Medical Center
                </span>
              </div>
            </button>

            {/* DESKTOP NAVIGATION */}

            <div className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-slate-50/80 p-1.5 shadow-inner lg:flex">

              {NAV_ITEMS.map((item) => (
                <button
                  key={item.target}
                  type="button"
                  onClick={() =>
                    handleSectionNavigation(item.target)
                  }
                  className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-white/80 hover:text-slate-900"
                >
                  {item.label}
                </button>
              ))}

            </div>

            {/* DESKTOP ACTIONS */}

            <div className="hidden items-center gap-3 lg:flex">

              {/* Language */}

              {/* <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsLanguageOpen(
                      (previous) => !previous
                    )
                  }
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                  aria-haspopup="menu"
                  aria-expanded={isLanguageOpen}
                >
                  <Globe
                    size={14}
                    className="text-[#1f9b90]"
                  />

                  <span>{currentLangLabel}</span>

                  <ChevronDown
                    size={14}
                    className={[
                      "text-slate-400 transition-transform duration-200",
                      isLanguageOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </button>

                {isLanguageOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5"
                    role="menu"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() =>
                          handleLanguageChange(
                            lang.code
                          )
                        }
                        className={[
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition",
                          language === lang.code
                            ? "bg-[#1f9b90]/10 font-semibold text-[#1f9b90]"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                        ].join(" ")}
                        role="menuitem"
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] text-slate-400">
                          {lang.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Availability */}

              <button
                type="button"
                onClick={() =>
                  handleSectionNavigation(
                    "availability"
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#1f9b90]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1f9b90]/30 active:translate-y-0"
              >
                <Calendar size={15} />
                <span>Check Availability</span>
              </button>

            </div>

            {/* MOBILE / TABLET */}

            <div className="flex items-center gap-2 lg:hidden">

              <button
                type="button"
                onClick={() =>
                  handleSectionNavigation(
                    "availability"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f9b90] px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#18837a] active:scale-95"
              >
                <Calendar size={14} />

                <span className="hidden sm:inline">
                  Check Availability
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsMobileMenuOpen(
                    (previous) => !previous
                  )
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                aria-label={
                  isMobileMenuOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X
                    size={20}
                    className="stroke-[2.2]"
                  />
                ) : (
                  <Menu
                    size={20}
                    className="stroke-[2.2]"
                  />
                )}
              </button>

            </div>

          </nav>

          {/* MOBILE DRAWER */}

          {isMobileMenuOpen && (
            <div className="max-h-[calc(100vh-7.5rem)] overflow-y-auto border-t border-slate-200/80 bg-white px-4 pb-6 pt-4 shadow-2xl lg:hidden">

              <div className="space-y-1">

                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.target}
                    type="button"
                    onClick={() =>
                      handleSectionNavigation(
                        item.target
                      )
                    }
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100/70 hover:text-slate-900"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}

              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                {/* Language */}

                {/* <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 p-2">

                  <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-500">
                    <Globe
                      size={15}
                      className="text-[#1f9b90]"
                    />
                    <span>Language</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() =>
                          handleLanguageChange(
                            lang.code
                          )
                        }
                        className={[
                          "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                          language === lang.code
                            ? "bg-white font-semibold text-[#1f9b90] shadow-xs"
                            : "text-slate-600 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                </div> */}

                {/* Booking */}

                <button
                  type="button"
                  onClick={() =>
                    handleSectionNavigation(
                      "availability"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-[#1f9b90]/20 active:scale-[0.99]"
                >
                  <Calendar size={18} />
                  <span>Check Doctor Availability</span>
                </button>

                {/* Emergency */}

                <a
                  href="tel:+916361069736"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/80 py-3 text-center text-sm font-semibold text-red-600 transition hover:bg-red-100/80 active:scale-[0.99]"
                >
                  <PhoneCall size={18} />
                  <span>
                    Call Emergency: +91 63610 69736
                  </span>
                </a>

              </div>
            </div>
          )}

        </div>
      </header>

      {/* Navbar spacer */}

      <div
        className="h-[117px]"
        aria-hidden="true"
      />
    </>
  );
}

export default Navbar;
