"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Calendar, BookOpen, Mail } from "lucide-react";
import { api, ENDPOINT } from "@/lib/api"; // <-- adjust to your path

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null); // Start with null
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const studentId = "3f117de0-db97-4eb7-a22c-eff68d9a855e"; // <-- Replace with your dynamic ID if you have routing

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(ENDPOINT.studentProfile(studentId));
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId]);

  const handleSave = async () => {
    console.log("Saving profile:", profile);
    setSaving(true);
    try {
      console.log(profile);
      await api.put(ENDPOINT.studentProfile(studentId), {
        user: {
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
        },
      });
      setIsEditing(false);
      // Optional: Show toast/notification of success
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Optional: Show error toast
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-1">My Profile</h2>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 mt-4 sm:mt-0"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-3xl font-semibold">
              <User className="2xl" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              {isEditing ? (
                <>
                  <Input
                    value={profile.user.first_name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        user: { ...profile.user, first_name: e.target.value },
                      })
                    }
                    className="mb-2 sm:mb-0"
                  />
                  <Input
                    value={profile.user.last_name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        user: { ...profile.user, last_name: e.target.value },
                      })
                    }
                  />
                </>
              ) : (
                <h3 className="text-2xl font-bold">
                  {profile.user.first_name} {profile.user.last_name}
                </h3>
              )}
            </div>
            <p className="text-gray-500">USN : {profile.registration_number}</p>
            <p className="text-gray-500">Section : {profile.section}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-md text-gray-500">
                {profile.user.email}
              </span>
            </div>
          </div>
          <div className="text-right min-w-fit">
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Semester {profile.current_semester}
                </span>
              </div>
              <Badge variant="default">Program : {profile.program_type}</Badge>
              <Badge variant="secondary">
                Batch : {profile.admission_year} - {profile.batch_year}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="admission_year">Admission Year</Label>
              <Input
                id="admission_year"
                type="number"
                value={profile.admission_year}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="batch_year">Batch Year</Label>
              <Input
                id="batch_year"
                type="number"
                value={profile.batch_year}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="current_semester">Current Semester</Label>
              <Input
                id="current_semester"
                type="number"
                value={profile.current_semester}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="program_type">Program Type</Label>
              <Input
                id="program_type"
                value={profile.program_type}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
          <CardDescription>Monitor your grades and credits</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {profile.cgpa}
            </div>
            <div className="text-sm text-gray-600">CGPA</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {profile.sgpa_current}
            </div>
            <div className="text-sm text-gray-600">Current SGPA</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">
              {profile.total_credits_completed}/{profile.total_credits_required}
            </div>
            <div className="text-sm text-gray-600">Credits Completed</div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
