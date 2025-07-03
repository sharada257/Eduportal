"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { api, ENDPOINT } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [department, setDepartment] = useState("")
  const [section, setSection] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [sections, setSections] = useState([])
  const [requestSent, setRequestSent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get(ENDPOINT.departments)
        setDepartments(response.data?.departments || [])
      } catch (err) {
        console.error("Failed to fetch departments", err)
      }
    }
    fetchDepartments()
  }, [])

  useEffect(() => {
    const fetchSections = async () => {
      if (!department) return
      try {
        const response = await api.get(ENDPOINT.departmentSections(department))
        setSections(response.data?.sections || [])
      } catch (err) {
        console.error("Failed to fetch sections", err)
        setSections([])
        setSection("")
      }
    }
    fetchSections()
  }, [department])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const res = await api.post(ENDPOINT.accountRequest, {
        email,
        password,
        department,
        section,
      })

      if (res.data.status === "request_sent") {
        setRequestSent(true)
      } else {
        alert("Something went wrong: " + res.data.message)
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data?.message || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Request Account</h1>
          <p className="mt-2 text-sm text-slate-600">Submit a request to join the platform</p>
        </div>

        <div className="mt-6 rounded-xl bg-white p-8 shadow-md ring-1 ring-slate-200">
          {requestSent ? (
            <div className="text-center text-green-600 font-medium">
              ✅ Your request has been submitted. Please wait for admin approval.
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
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

              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={department}
                  onValueChange={(value) => {
                    setDepartment(value)
                    setSection("")
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {department && (
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((sect) => (
                        <SelectItem key={sect.value} value={sect.value}>
                          {sect.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full bg-slate-900 text-gray-800 hover:bg-slate-800" disabled={isLoading}>
                {isLoading ? "Sending Request..." : "Submit Request"}
              </Button>
            </form>
          )}

          {!requestSent && (
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
