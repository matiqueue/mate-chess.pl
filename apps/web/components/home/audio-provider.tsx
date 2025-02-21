"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useContext,
} from "react";
import { usePathname } from "next/navigation";

type AudioContextType = {
  isPlaying: boolean;
  toggleMusic: (event?: React.MouseEvent) => void;
};

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
});

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/home") {
      // Jeśli nie mamy jeszcze audio, tworzymy je
      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/bgMusic.mp3");
        audioRef.current.volume = 0.1;
        audioRef.current.loop = true;
      }
    } else {
      // Jeśli opuszczamy /home, pauzujemy muzykę i resetujemy stan
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [pathname]);

  const toggleMusic = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) =>
          console.error("Błąd odtwarzania muzyki:", error)
        );
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
