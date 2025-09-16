"use client"

import type React from "react"
import { Children, cloneElement, createContext, useContext, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const DOCK_HEIGHT = 128
const DEFAULT_MAGNIFICATION = 80
const DEFAULT_DISTANCE = 150
const DEFAULT_PANEL_HEIGHT = 64

type DockProps = {
  children: React.ReactNode
  className?: string
  distance?: number
  panelHeight?: number
  magnification?: number
}
type DockItemProps = {
  className?: string
  children: React.ReactNode
}
type DockLabelProps = {
  className?: string
  children: React.ReactNode
}
type DockIconProps = {
  className?: string
  children: React.ReactNode
}

type DocContextType = {
  magnification: number
  distance: number
}
type DockProviderProps = {
  children: React.ReactNode
  value: DocContextType
}

const DockContext = createContext<DocContextType | undefined>(undefined)

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>
}

function useDock() {
  const context = useContext(DockContext)
  if (!context) {
    throw new Error("useDock must be used within an DockProvider")
  }
  return context
}

function Dock({
                children,
                className,
                magnification = DEFAULT_MAGNIFICATION,
                distance = DEFAULT_DISTANCE,
                panelHeight = DEFAULT_PANEL_HEIGHT,
              }: DockProps) {
  return (
      <div className="mx-2 flex max-w-full items-end overflow-x-auto">
        <div
            className={cn("mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4 dark:bg-neutral-900", className)}
            style={{ height: panelHeight }}
            role="toolbar"
            aria-label="Application dock"
        >
          <DockProvider value={{ distance, magnification }}>{children}</DockProvider>
        </div>
      </div>
  )
}

function DockItem({ children, className }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
      <div
          ref={ref}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={cn(
              "relative inline-flex items-center justify-center w-12 transition-transform hover:scale-110",
              className,
          )}
          tabIndex={0}
          role="button"
          aria-haspopup="true"
      >
        {Children.map(children, (child) => cloneElement(child as React.ReactElement, { isHovered }))}
      </div>
  )
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>
  const isHovered = restProps["isHovered"] as boolean

  return (
      <>
        {isHovered && (
            <div
                className={cn(
                    "absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white transform -translate-x-1/2",
                    className,
                )}
                role="tooltip"
            >
              {children}
            </div>
        )}
      </>
  )
}

function DockIcon({ children, className }: DockIconProps) {
  return <div className={cn("flex items-center justify-center w-6 h-6", className)}>{children}</div>
}

export { Dock, DockIcon, DockItem, DockLabel }
