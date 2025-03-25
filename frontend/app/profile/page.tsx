"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { logOut } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // In a real app, you would update the user profile in Firebase
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess("Profile updated successfully")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await logOut()
    if (!error) {
      router.push("/")
    }
  }

  const handleSendPasswordResetEmail = async () => {
    try {
      const auth = getAuth()
      if (user?.email) {
        await sendPasswordResetEmail(auth, user.email)
        setResetEmailSent(true)
        setSuccess("Password reset email sent. Check your inbox.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    }
  }

  return (
    <Layout>
      <ProtectedRoute>
        <div className="container py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account information here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {success && (
                      <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={user?.email || ""} 
                          disabled 
                        />
                        <p className="text-sm text-muted-foreground">
                          Your email cannot be changed
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          value={displayName} 
                          onChange={(e) => setDisplayName(e.target.value)} 
                        />
                      </div>
                      <Button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Change Password</h3>
                      <p className="text-sm text-muted-foreground">
                        For security reasons, you'll receive an email with instructions to reset your password.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleSendPasswordResetEmail}
                        disabled={resetEmailSent}
                      >
                        {resetEmailSent ? "Email Sent" : "Send Password Reset Email"}
                      </Button>
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t">
                      <h3 className="font-medium">Sign Out</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign out from your account on this device
                      </p>
                      <Button variant="outline" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t">
                      <h3 className="font-medium text-red-600">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ProtectedRoute>
    </Layout>
  )
} 