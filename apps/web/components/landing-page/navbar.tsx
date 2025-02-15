"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/landing-page/navbar.module.css";
import { Fraunces } from "next/font/google";
import { FaMusic } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "300",
});

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  // Inicjalizuj audio TYLKO na stronie głównej ("/")
  useEffect(() => {
    if (pathname === "/") {
      audioRef.current = new Audio("/audio/bgMusic.mp3");
      audioRef.current.volume = 0.1;
      audioRef.current.loop = true;

      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      const handleFirstClick = () => {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) =>
              console.error("Błąd odtwarzania muzyki:", error)
            );
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      document.addEventListener("click", handleFirstClick, { once: true });

      // Czyścimy po sobie – gdy komponent się odmontuje
      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("click", handleFirstClick);
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      };
    }
  }, [pathname]);

  // Jeśli zmieniamy ścieżkę i nie jesteśmy już na stronie głównej, pauzuj muzykę
  useEffect(() => {
    if (pathname !== "/" && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMusic = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) =>
          console.error("Błąd odtwarzania muzyki:", error)
        );
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <svg
          className={styles.logoIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            className={styles.svgPath}
            d="M256 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-95.2-8c-18.1 0-31.3 12.8-35.6 26.9c-8 26.2-32.4 45.2-61.2 45.2c-10 0-19.4-2.3-27.7-6.3c-7.6-3.7-16.7-3.3-24 1.2C.7 162.1-3.1 177.1 3.7 188.9L97.6 352l55.4 0-83-144.1c40.5-2.2 75.3-25.9 93.1-59.8c22 26.8 55.4 43.9 92.8 43.9s70.8-17.1 92.8-43.9c17.8 34 52.6 57.7 93.1 59.8L359 352l55.4 0 93.9-163.1c6.8-11.7 3-26.7-8.6-33.8c-7.3-4.5-16.4-4.9-24-1.2c-8.4 4-17.7 6.3-27.7 6.3c-28.8 0-53.2-19-61.2-45.2C382.5 100.8 369.3 88 351.2 88c-14.5 0-26.3 8.5-32.4 19.3c-12.4 22-35.9 36.7-62.8 36.7s-50.4-14.8-62.8-36.7C187.1 96.5 175.4 88 160.8 88zM133.2 432l245.6 0 16.6 32-278.7 0 16.6-32zm283.7-30.7c-5.5-10.6-16.5-17.3-28.4-17.3l-265 0c-12 0-22.9 6.7-28.4 17.3L68.6 452.5c-3 5.8-4.6 12.2-4.6 18.7c0 22.5 18.2 40.8 40.8 40.8l302.5 0c22.5 0 40.8-18.2 40.8-40.8c0-6.5-1.6-12.9-4.6-18.7l-26.5-51.2z"
          />
        </svg>
        <span className={`${fraunces.className} ${styles.navLogo}`} onClick={toggleMenu}>
          Mate-Chess
        </span>
      </div>

      <div className={styles.navRight}>
        <div
          className={`${styles.musicButton} ${isPlaying ? styles.musicButtonPlaying : ""}`}
          onClick={toggleMusic}
        >
          {[...Array(7)].map((_, i) => (
            <span key={i} className={styles.musicStroke}></span>
          ))}
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <ul className={styles.dropdownMenu}>
          <li className={styles.dropdownItem} onClick={toggleMusic}>
            <FaMusic className={styles.dropdownIcon} />
            <span className={fraunces.className}>
              {isPlaying ? "Pause Music" : "Play Music"}
            </span>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
