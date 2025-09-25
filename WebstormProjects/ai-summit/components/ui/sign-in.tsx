"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const SignIn = ({ onBack }: { onBack: () => void }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })

        if (error) {
          setError(error.message)
          return
        }

        alert("Check your email for verification link!")
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
          return
        }

        router.push("/dashboard")
      }
    } catch (err) {
      console.error("[v0] Sign in error:", err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      console.error("[v0] Google login error:", err)
      setError("Google login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      console.error("[v0] GitHub login error:", err)
      setError("GitHub login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-2xl border border-border p-8 flex flex-col items-center shadow-lg">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-6">
          <span className="text-primary font-bold text-lg">F</span>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-center text-foreground">
          {isSignUp ? "Create Account" : "Sign in to FinCoPilot"}
        </h2>

        <p className="text-muted-foreground text-xs mb-6 text-center">
          {isSignUp
            ? "Join thousands optimizing their finances with AI"
            : "Access your financial dashboard and insights"}
        </p>

        <div className="w-full flex flex-col gap-3 mb-4">
          <div className="relative">
            <input
              placeholder="Email address"
              type="email"
              value={email}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground text-xs placeholder:text-muted-foreground"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background text-foreground text-xs placeholder:text-muted-foreground"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-xs text-red-400 text-left px-1">{error}</div>}

          {!isSignUp && (
            <div className="w-full flex justify-end">
              <button className="text-xs text-primary hover:text-primary/80 font-medium">Forgot password?</button>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl hover:bg-primary/90 transition-colors mb-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
        </button>

        <div className="flex items-center w-full my-3">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-3 text-xs text-muted-foreground">Or continue with</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <div className="flex gap-3 w-full justify-center mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center flex-1 h-11 rounded-xl border border-border bg-card hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xs font-medium text-foreground">Google</span>
          </button>
          <button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="flex items-center justify-center flex-1 h-11 rounded-xl border border-border bg-card hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xs font-medium text-foreground">GitHub</span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-xs text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-primary hover:text-primary/80 font-medium ml-1"
            disabled={isLoading}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-foreground mt-6"
          disabled={isLoading}
        >
          ← Back to home
        </button>
      </div>
    </div>
  )
}

export { SignIn }
