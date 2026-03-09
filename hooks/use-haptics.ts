"use client"

import { useWebHaptics } from "web-haptics/react"

export function useHaptics() {
  const { trigger, isSupported } = useWebHaptics()

  return {
    tapLight: () => {
      if (isSupported) trigger("light")
    },
    tapMedium: () => {
      if (isSupported) trigger("medium")
    },
    tapSuccess: () => {
      if (isSupported) trigger("success")
    },
    tapError: () => {
      if (isSupported) trigger("error")
    },
    tapWarning: () => {
      if (isSupported) trigger("warning")
    },
    triggerCustom: (pattern: Array<{ duration: number; delay?: number; intensity?: number }>) => {
      if (isSupported) trigger(pattern)
    },
    isSupported,
    trigger,
  }
}
