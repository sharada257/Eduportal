"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, ENDPOINT } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await api.post(ENDPOINT.login, {
        email,
        password,
      })

      const data = res.data

      // Save tokens in localStorage (or zustand/auth context)
      localStorage.setItem("accessToken", data.access)
      localStorage.setItem("refreshToken", data.refresh)
      localStorage.setItem("userId", data.user_id)
      localStorage.setItem("userType", data.user_type)

      // Optionally store profile info
      localStorage.setItem("profile", JSON.stringify(data.profile))

      // Redirect to dashboard based on user type
      if (data.user_type === "student") {
        router.push("/student/dashboard")
      } else if (data.user_type === "teacher") {
        router.push("/teacher/dashboard")
      } else if (data.user_type === "admin") {
        router.push("/admin/dashboard")
      } else {
        setError("Unknown user type. Contact admin.")
      }
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Sign In</h1>
          <p className="mt-2 text-sm text-slate-600">Access your account</p>
        </div>

        <div className="mt-6 rounded-xl bg-white p-8 shadow-md ring-1 ring-slate-200">
          {error && (
            <div className="mb-4 text-center text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-slate-900 text-gray-800 hover:bg-slate-800" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Request Access
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
