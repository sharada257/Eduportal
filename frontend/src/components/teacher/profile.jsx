"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Edit,
  Building,
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  // {
  //   name: "Dr. Sarah Wilson",
  //   email: "sarah.wilson@university.edu",
  //   phone: "+1 (555) 123-4567",
  //   department: "Mathematics Department",
  //   office: "Room 204, Science Building",
  //   bio: "Professor of Mathematics with 15 years of teaching experience. Specializing in Calculus, Linear Algebra, and Mathematical Analysis.",
  //   joinDate: "September 2019",
  //   employee_id: "EMP001234",
  //   title: "Professor",
  //   specialization: "Mathematics",
  // }

  //   {
  //     "id": "4d309d03-3bb7-4bc5-8817-01237437c7ec",
  //     "user": {
  //         "id": "df6fa197-a858-420b-83ab-c4ba4dcb6e41",
  //         "email": "a@gmail.com",
  //         "is_active": true,
  //         "is_verified": false,
  //         "user_type": ""
  //     },
  //     "employee_id": null,
  //     "designation": "ASSISTANT PROFESSOR",
  //     "qualification": "BSC",
  //     "experience_years": 0.0,
  //     "department": {
  //         "id": "93c8dd17-5ec6-463b-be35-70d42c7c36fa",
  //         "department_name": "COMPUTER SCIENCE"
  //     },
  //     "office_location": "",
  //     "created_at": "2025-07-05T08:32:02.649515Z",
  //     "updated_at": "2025-07-05T08:32:02.649531Z"
  // }

  const teacherId = "4d309d03-3bb7-4bc5-8817-01237437c7ec"; // Replace with your dynamic ID if you have routing

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(ENDPOINT.teacherProfile(teacherId));
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [teacherId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log(profile);
      await api.put(ENDPOINT.teacherProfile(teacherId), {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <p className="text-gray-600">
            Manage your personal and professional information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-xl font-semibold">
                SW
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{profile.user.first_name} {profile.user.last_name}</h3>
              <p className="text-lg text-gray-600">{profile.designation}</p>
              <p className="text-gray-500">{profile.department.department_name}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="default">{profile.designation}</Badge>
                <Badge variant="secondary">{profile.specialization}</Badge>
                <Badge variant="outline">
                  Employee ID: {profile.employee_id}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {profile.joinDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{profile.office}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className={`pl-10 ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
            
            
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Professional Information
            </CardTitle>
            <CardDescription>
              Your academic and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={profile.designation}
                onChange={(e) =>
                  setProfile({ ...profile, title: e.target.value })
                }
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profile.department.department_name}
                onChange={(e) =>
                  setProfile({ ...profile, department: e.target.value })
                }
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profile.specialization}
                onChange={(e) =>
                  setProfile({ ...profile, specialization: e.target.value })
                }
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                value={profile.employee_id}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                value={profile.joinDate}
                disabled
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Bio</CardTitle>
          <CardDescription>
            Tell others about your background and expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              rows={6}
              className={!isEditing ? "bg-gray-50" : ""}
              placeholder="Write a brief description about your professional background, expertise, and teaching philosophy..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Teaching Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Statistics</CardTitle>
          <CardDescription>Your teaching performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Active Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">65</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-sm text-gray-600">Avg. Rating</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">15</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
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
