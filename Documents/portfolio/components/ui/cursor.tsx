"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type CursorContextType = {
  cursorPos: { x: number; y: number }
  isActive: boolean
  containerRef: React.RefObject<HTMLDivElement>
  cursorRef: React.RefObject<HTMLDivElement>
}

const CursorContext = React.createContext<CursorContextType | undefined>(undefined)

const useCursor = (): CursorContextType => {
  const context = React.useContext(CursorContext)
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider")
  }
  return context
}

type CursorProviderProps = Omit<React.ComponentProps<"div">, "ref"> & {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function CursorProvider({ ref, children, ...props }: CursorProviderProps) {
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null!)
  const cursorRef = React.useRef<HTMLDivElement>(null!)

  React.useImperativeHandle(ref, () => containerRef.current)

  React.useEffect(() => {
    if (!containerRef.current) return

    const parent = containerRef.current.parentElement
    if (!parent) return

    if (getComputedStyle(parent).position === "static") {
      parent.style.position = "relative"
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setIsActive(true)
    }
    const handleMouseLeave = () => setIsActive(false)

    parent.addEventListener("mousemove", handleMouseMove)
    parent.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove)
      parent.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
      <CursorContext.Provider value={{ cursorPos, isActive, containerRef, cursorRef }}>
        <div ref={containerRef} data-slot="cursor-provider" {...props}>
          {children}
        </div>
      </CursorContext.Provider>
  )
}

type CursorProps = Omit<React.ComponentProps<"div">, "ref"> & {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function Cursor({ ref, children, className, style, ...props }: CursorProps) {
  const { cursorPos, isActive, containerRef, cursorRef } = useCursor()

  // @ts-ignore
  React.useImperativeHandle(ref, () => cursorRef.current)

  React.useEffect(() => {
    const parentElement = containerRef.current?.parentElement

    if (parentElement && isActive) parentElement.style.cursor = "none"

    return () => {
      if (parentElement) parentElement.style.cursor = "default"
    }
  }, [containerRef, cursorPos, isActive])

  if (!isActive) return null

  return (
      <div
          ref={cursorRef}
          data-slot="cursor"
          className={cn("pointer-events-none z-[9999] absolute transition-all duration-100", className)}
          style={{
            top: cursorPos.y,
            left: cursorPos.x,
            transform: "translate(-50%, -50%)",
            ...style,
          }}
          {...props}
      >
        {children}
      </div>
  )
}

type Align = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right" | "left" | "right" | "center"

type CursorFollowProps = Omit<React.ComponentProps<"div">, "ref"> & {
  sideOffset?: number
  align?: Align
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function CursorFollow({
                        ref,
                        sideOffset = 15,
                        align = "bottom-right",
                        children,
                        className,
                        style,
                        ...props
                      }: CursorFollowProps) {
  const { cursorPos, isActive, cursorRef } = useCursor()
  const cursorFollowRef = React.useRef<HTMLDivElement>(null!)

  React.useImperativeHandle(ref, () => cursorFollowRef.current)

  const calculateOffset = React.useCallback(() => {
    const rect = cursorFollowRef.current?.getBoundingClientRect()
    const width = rect?.width ?? 0
    const height = rect?.height ?? 0

    let newOffset

    switch (align) {
      case "center":
        newOffset = { x: width / 2, y: height / 2 }
        break
      case "top":
        newOffset = { x: width / 2, y: height + sideOffset }
        break
      case "top-left":
        newOffset = { x: width + sideOffset, y: height + sideOffset }
        break
      case "top-right":
        newOffset = { x: -sideOffset, y: height + sideOffset }
        break
      case "bottom":
        newOffset = { x: width / 2, y: -sideOffset }
        break
      case "bottom-left":
        newOffset = { x: width + sideOffset, y: -sideOffset }
        break
      case "bottom-right":
        newOffset = { x: -sideOffset, y: -sideOffset }
        break
      case "left":
        newOffset = { x: width + sideOffset, y: height / 2 }
        break
      case "right":
        newOffset = { x: -sideOffset, y: height / 2 }
        break
      default:
        newOffset = { x: 0, y: 0 }
    }

    return newOffset
  }, [align, sideOffset])

  if (!isActive) return null

  const offset = calculateOffset()
  const cursorRect = cursorRef.current?.getBoundingClientRect()
  const cursorWidth = cursorRect?.width ?? 20
  const cursorHeight = cursorRect?.height ?? 20

  const finalX = cursorPos.x - offset.x + cursorWidth / 2
  const finalY = cursorPos.y - offset.y + cursorHeight / 2

  return (
      <div
          ref={cursorFollowRef}
          data-slot="cursor-follow"
          className={cn("pointer-events-none z-[9998] absolute transition-all duration-200", className)}
          style={{
            top: finalY,
            left: finalX,
            transform: "translate(-50%, -50%)",
            ...style,
          }}
          {...props}
      >
        {children}
      </div>
  )
}

export {
  CursorProvider,
  Cursor,
  CursorFollow,
  useCursor,
  type CursorContextType,
  type CursorProviderProps,
  type CursorProps,
  type CursorFollowProps,
}