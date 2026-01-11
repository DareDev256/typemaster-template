"use client";

import { motion } from "framer-motion";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { PixelIcon } from "@/components/ui/PixelIcon";

export function SoundToggle() {
  const { isMuted, toggleMute, playSound } = useSoundEffects();

  const handleToggle = () => {
    toggleMute();
    // Play a small sound when unmuting to confirm it works
    if (isMuted) {
      // Will be unmuted after toggle, play confirmation
      setTimeout(() => playSound("keypress"), 50);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="p-1"
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      <PixelIcon name={isMuted ? "sound-off" : "sound-on"} size={24} />
    </motion.button>
  );
}
