"use client"

import { cn } from "@/lib/utils"
import type React from "react"

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export const GlassButton = ({ variant = "primary", size = "md", className, children, ...props }: GlassButtonProps) => {
  const variants = {
    primary: "bg-white text-black border-white hover:bg-gray-100 hover:text-black",
    secondary: "bg-gray-900 text-white border-gray-700 hover:bg-gray-800 hover:text-white",
    outline: "bg-gray-900 text-white border-white/80 hover:bg-gray-800 hover:text-white",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  return (
      <button
          className={cn(
              "relative inline-flex items-center justify-center rounded-full border transition-all duration-300 font-medium",
              "shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
              "hover:scale-[1.02] active:scale-[0.98] transform",
              variants[variant],
              sizes[size],
              className,
          )}
          {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
  )
}
