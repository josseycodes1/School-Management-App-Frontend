"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import FormModal from "@/components/FormModal";

type UserProfile = {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "student" | "teacher" | "parent" | "admin";
    is_verified: boolean;
    date_joined: string;
  };
  phone?: string;
  address?: string;
  gender?: string;
  birth_date?: string;
  photo?: string;
  blood_type?: string;
  // Student specific
  admission_number?: string;
  class_level?: string;
  parent_name?: string;
  parent_contact?: string;
  medical_notes?: string;
  is_onboarded?: boolean;
  // Teacher specific
  subject_specialization?: string;
  hire_date?: string;
  qualifications?: string;
  is_principal?: boolean;
  // Parent specific
  emergency_contact?: string;
  occupation?: string;
  // Admin specific
  department?: string;
  position?: string;
};

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast.error("Please login again");
          router.push("/login");
          return;
        }

        // Get user data from localStorage first (from login response)
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          // Try to fetch detailed profile based on role
          try {
            let profileEndpoint = "";
            switch (parsedUser.role) {
              case "student":
                profileEndpoint = `/api/accounts/students/`;
                break;
              case "teacher":
                profileEndpoint = `/api/accounts/teachers/`;
                break;
              case "parent":
                profileEndpoint = `/api/accounts/parents/`;
                break;
              case "admin":
                profileEndpoint = `/api/accounts/admins/`;
                break;
            }

            if (profileEndpoint) {
              const profileResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${profileEndpoint}`,
                {
                  headers: { Authorization: `Bearer ${accessToken}` },
                }
              );

              // Find the profile that matches the current user
              const profileData = profileResponse.data.results?.find(
                (item: any) => item.user?.id === parsedUser.id
              ) || profileResponse.data.find(
                (item: any) => item.user?.id === parsedUser.id
              );

              if (profileData) {
                setProfile({ ...profileData, user: parsedUser });
                setLoading(false);
                return;
              }
            }
          } catch (profileError) {
            console.log("Could not fetch detailed profile, using basic info");
          }

          // Fallback: Use basic user data from localStorage
          setProfile({
            id: parsedUser.id,
            user: parsedUser,
            phone: "",
            address: "",
          } as UserProfile);
          setLoading(false);
          return;
        }

        throw new Error("No user data found");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const getProfilePictureUrl = (url?: string) => {
    if (!url) return "/avatar.png";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      student: "Student",
      teacher: "Teacher",
      parent: "Parent",
      admin: "Administrator",
    };
    return roleMap[role] || role;
  };

  const getGenderDisplay = (gender?: string) => {
    const genderMap: { [key: string]: string } = {
      M: "Male",
      F: "Female",
      O: "Other",
      N: "Prefer not to say",
    };
    return gender ? genderMap[gender] || gender : "Not provided";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-josseypink1"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-josseypink1 text-white px-4 py-2 rounded-lg hover:bg-josseypink2 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={getProfilePictureUrl(profile.photo)}
                  alt={`${profile.user.first_name} ${profile.user.last_name}`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-josseypink1"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.user.first_name} {profile.user.last_name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {getRoleDisplayName(profile.user.role)}
                  {profile.user.role === "teacher" && profile.is_principal && " • Principal"}
                  {profile.user.role === "student" && profile.admission_number && ` • ${profile.admission_number}`}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {profile.user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Joined {formatDate(profile.user.date_joined)}
                  </span>
                  <span className={`flex items-center gap-1 ${profile.user.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {profile.user.is_verified ? "Verified" : "Pending Verification"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <FormModal
                table={profile.user.role}
                type="update"
                data={profile}
                onSuccess={(updatedProfile) => setProfile(updatedProfile)}
                className="bg-josseypink1 hover:bg-josseypink2 text-white px-6 py-2 rounded-lg transition-colors"
              />
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {["personal", "academic", "contact", "settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-josseypink1 text-josseypink1"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name</span>
                        <span className="font-medium">{profile.user.first_name} {profile.user.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender</span>
                        <span className="font-medium">{getGenderDisplay(profile.gender)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth</span>
                        <span className="font-medium">{formatDate(profile.birth_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Type</span>
                        <span className="font-medium">{profile.blood_type || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Role Specific Information */}
                  {profile.user.role === "student" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parent/Guardian</span>
                          <span className="font-medium">{profile.parent_name || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Parent Contact</span>
                          <span className="font-medium">{profile.parent_contact || "Not provided"}</span>
                        </div>
                        {profile.medical_notes && (
                          <div>
                            <span className="text-gray-600 block mb-1">Medical Notes</span>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{profile.medical_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.user.role === "teacher" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Specialization</span>
                          <span className="font-medium">{profile.subject_specialization || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hire Date</span>
                          <span className="font-medium">{formatDate(profile.hire_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Principal</span>
                          <span className="font-medium">{profile.is_principal ? "Yes" : "No"}</span>
                        </div>
                        {profile.qualifications && (
                          <div>
                            <span className="text-gray-600 block mb-1">Qualifications</span>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{profile.qualifications}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Parent Specific Information */}
                  {profile.user.role === "parent" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Occupation</span>
                          <span className="font-medium">{profile.occupation || "Not provided"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency Contact</span>
                          <span className="font-medium">{profile.emergency_contact || "Not provided"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Specific Information */}
                  {profile.user.role === "admin" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Department</span>
                          <span className="font-medium">{profile.department || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Position</span>
                          <span className="font-medium">{profile.position || "Not specified"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Student Academic Info */}
                  {profile.user.role === "student" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Class Level</span>
                          <span className="font-medium">{profile.class_level || "Not assigned"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Admission Number</span>
                          <span className="font-medium">{profile.admission_number || "Not assigned"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Onboarding Status</span>
                          <span className={`font-medium ${profile.is_onboarded ? 'text-green-600' : 'text-yellow-600'}`}>
                            {profile.is_onboarded ? "Completed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* System Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID</span>
                        <span className="font-medium text-sm">{profile.user.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Created</span>
                        <span className="font-medium">{formatDate(profile.user.date_joined)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email Verification</span>
                        <span className={`font-medium ${profile.user.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {profile.user.is_verified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {activeTab === "contact" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-medium">{profile.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">Email Address</p>
                          <p className="font-medium">{profile.user.email}</p>
                        </div>
                      </div>

                      {profile.emergency_contact && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">Emergency Contact</p>
                            <p className="font-medium">{profile.emergency_contact}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {profile.address ? (
                        <p className="text-gray-700">{profile.address}</p>
                      ) : (
                        <p className="text-gray-500 italic">No address provided</p>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                        Update Contact Information
                      </button>
                      <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                        Verify Phone Number
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Academic Tab - For Students */}
            {activeTab === "academic" && profile.user.role === "student" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-josseypink1 text-white p-4 rounded-lg">
                    <h4 className="font-semibold">Current Grade</h4>
                    <p className="text-2xl font-bold mt-2">{profile.class_level || "N/A"}</p>
                  </div>
                  <div className="bg-josseypink2 text-white p-4 rounded-lg">
                    <h4 className="font-semibold">Attendance</h4>
                    <p className="text-2xl font-bold mt-2">95%</p>
                  </div>
                  <div className="bg-josseypink1 text-white p-4 rounded-lg">
                    <h4 className="font-semibold">Overall GPA</h4>
                    <p className="text-2xl font-bold mt-2">3.8</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Subjects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Mathematics", "English", "Science", "History", "Art", "Physical Education"].map((subject) => (
                      <div key={subject} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="font-medium">{subject}</span>
                        <span className="text-josseypink1 font-semibold">A-</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-josseypink1 text-white rounded-lg hover:bg-josseypink2 transition-colors">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-josseypink1"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-red-800 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show message for non-students on academic tab */}
            {activeTab === "academic" && profile.user.role !== "student" && (
              <div className="text-center py-8">
                <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Academic Information</h3>
                  <p className="text-gray-600">
                    {profile.user.role === "teacher" 
                      ? "Academic information is available for students only." 
                      : "This section displays academic performance and subjects for students."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;