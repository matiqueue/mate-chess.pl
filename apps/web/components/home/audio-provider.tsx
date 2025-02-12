"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useContext,
} from "react";

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

  useEffect(() => {
    audioRef.current = new Audio("/audio/bgMusic.mp3");
    audioRef.current.volume = 0.1;
    audioRef.current.loop = true;
  }, []);

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
