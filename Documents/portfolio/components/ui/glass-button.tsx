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
    primary: "!bg-white !text-black border-white hover:!bg-gray-100 hover:!text-black shadow-lg",
    secondary: "!bg-gray-900 !text-white border-gray-700 hover:!bg-gray-800 hover:!text-white shadow-lg",
    outline: "!bg-transparent !text-white border-white/80 hover:!bg-white/10 hover:!text-white shadow-lg",
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
