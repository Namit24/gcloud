"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SignInDialog } from "@/components/auth/sign-in-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"
import { LogOut, PieChart, BarChart3, Menu } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { user, loading, signOut } = useAuth()
  const [showSignIn, setShowSignIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="elegant-header sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              FiNexus AI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#what-is" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              What is it?
            </a>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/portfolio"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Analytics
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {loading ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                        alt={user.user_metadata?.full_name}
                      />
                      <AvatarFallback className="text-sm">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium">{user.user_metadata?.full_name || "User"}</p>
                      <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="text-sm">
                      <PieChart className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/portfolio" className="text-sm">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Portfolio Analytics
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowSignIn(true)} size="sm" className="text-sm px-4 py-2">
                  Sign In
                </Button>
                <Button
                  onClick={() => setShowSignIn(true)}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-sm px-4 py-2"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <a
                    href="#what-is"
                    className="text-lg font-medium text-foreground hover:text-emerald-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    What is it?
                  </a>
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-lg font-medium text-foreground hover:text-emerald-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/portfolio"
                        className="text-lg font-medium text-foreground hover:text-emerald-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Portfolio Analytics
                      </Link>
                      <div className="pt-4 border-t">
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.user_metadata?.avatar_url || "/placeholder.svg"}
                              alt={user.user_metadata?.full_name}
                            />
                            <AvatarFallback>
                              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.user_metadata?.full_name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 pt-4 border-t">
                      <Button
                        onClick={() => {
                          setShowSignIn(true)
                          setMobileMenuOpen(false)
                        }}
                        variant="outline"
                        className="w-full text-base py-3"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          setShowSignIn(true)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-base py-3"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </header>
  )
}
