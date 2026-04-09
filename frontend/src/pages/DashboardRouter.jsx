import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Onboarding from './Onboarding';
import PrincipalDashboard from './PrincipalDashboard';
import TeacherDashboard from './TeacherDashboard';
import ParentDashboard from './ParentDashboard';


export default function DashboardRouter({ session }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${session.user.id}`);
        setProfile(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // Profile not found, needs onboarding
          setProfile(null);
        } else {
          console.error("Error fetching profile", error);
        }
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no profile, they need to enter a code or create school
  if (!profile) {
    return <Onboarding session={session} onComplete={setProfile} />;
  }

  return (
    <Routes>
      <Route path="/" element={
        profile.role === 'PRINCIPAL' ? <Navigate to="/dashboard/principal" /> :
        profile.role === 'TEACHER' ? <Navigate to="/dashboard/teacher" /> :
        <Navigate to="/dashboard/parent" />
      } />
      <Route path="/principal/*" element={<PrincipalDashboard profile={profile} />} />
      <Route path="/teacher/*" element={<TeacherDashboard profile={profile} />} />
      <Route path="/parent/*" element={<ParentDashboard profile={profile} />} />
    </Routes>
  );
}
