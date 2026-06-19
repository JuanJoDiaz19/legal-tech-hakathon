'use client';

import { useRef } from 'react';

const SRC = '/fondo-rojo.mp4';
const START_AT = 1.2;

export function VideoBackground() {
  const ref = useRef<HTMLVideoElement | null>(null);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden
      onLoadedMetadata={(e) => {
        e.currentTarget.currentTime = START_AT;
      }}
      onEnded={(e) => {
        e.currentTarget.currentTime = START_AT;
        void e.currentTarget.play();
      }}
      className="hero-video absolute inset-0 w-full h-full object-cover opacity-60 animate-video-in"
    >
      <source src={`${SRC}#t=${START_AT}`} type="video/mp4" />
    </video>
  );
}
