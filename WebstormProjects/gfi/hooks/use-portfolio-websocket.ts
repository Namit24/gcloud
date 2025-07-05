"use client"

import { useState, useEffect, useRef } from "react"
import type { MarketDataUpdate } from "@/types/portfolio"

interface UsePortfolioWebSocketProps {
  symbols: string[]
  enabled?: boolean
}

export function usePortfolioWebSocket({ symbols, enabled = true }: UsePortfolioWebSocketProps) {
  const [marketData, setMarketData] = useState<Map<string, MarketDataUpdate>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = () => {
    if (!enabled || symbols.length === 0) return

    try {
      // Mock WebSocket connection for demo
      // In production, replace with actual WebSocket URL
      const ws = new WebSocket("wss://echo.websocket.org/")

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        console.log("WebSocket connected")

        // Subscribe to symbols
        ws.send(
          JSON.stringify({
            action: "subscribe",
            symbols: symbols,
          }),
        )

        // Start mock data simulation
        startMockDataSimulation()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "price_update") {
            const update: MarketDataUpdate = {
              symbol: data.symbol,
              price: data.price,
              change: data.change,
              changePercentage: data.changePercentage,
              timestamp: new Date(data.timestamp),
            }

            setMarketData((prev) => new Map(prev.set(data.symbol, update)))
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
        }
      }

      ws.onclose = () => {
        setIsConnected(false)
        console.log("WebSocket disconnected")

        // Attempt to reconnect after 5 seconds
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, 5000)
        }
      }

      ws.onerror = (error) => {
        setError("WebSocket connection error")
        console.error("WebSocket error:", error)
      }

      wsRef.current = ws
    } catch (err) {
      setError("Failed to connect to WebSocket")
      console.error("WebSocket connection error:", err)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsConnected(false)
  }

  // Mock data simulation for demo purposes
  const startMockDataSimulation = () => {
    const interval = setInterval(() => {
      if (!isConnected) {
        clearInterval(interval)
        return
      }

      symbols.forEach((symbol) => {
        // Simulate price changes
        const basePrice = 1000 + Math.random() * 2000
        const change = (Math.random() - 0.5) * 50
        const changePercentage = (change / basePrice) * 100

        const update: MarketDataUpdate = {
          symbol,
          price: basePrice + change,
          change,
          changePercentage,
          timestamp: new Date(),
        }

        setMarketData((prev) => new Map(prev.set(symbol, update)))
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }

  useEffect(() => {
    if (enabled && symbols.length > 0) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [symbols, enabled])

  return {
    marketData,
    isConnected,
    error,
    connect,
    disconnect,
  }
}
