import React from 'react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Users, User, ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === 'principal') {
      navigate(createPageUrl('SetupSchool'));
    } else if (role === 'teacher') {
      navigate(createPageUrl('JoinSchool'));
    } else {
      navigate(createPageUrl('ParentLogin'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <span className="font-bold text-2xl text-slate-800 tracking-tight">EduSphere</span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Role</h1>
        <p className="text-slate-500">How will you be using the EduSphere platform today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <RoleCard
          title="Principal"
          description="School administration, manage teachers, and view campus-wide analytics."
          icon={<Shield className="w-10 h-10 text-blue-600" />}
          onClick={() => handleRoleSelect('principal')}
        />
        <RoleCard
          title="Teacher"
          description="Mark attendance, track student engagement, and receive at-risk alerts."
          icon={<Users className="w-10 h-10 text-blue-600" />}
          onClick={() => handleRoleSelect('teacher')}
        />
        <RoleCard
          title="Parent"
          description="Simple view of your child's attendance and academic engagement."
          icon={<User className="w-10 h-10 text-blue-600" />}
          onClick={() => handleRoleSelect('parent')}
        />
      </div>

      <div className="mt-12">
        <p className="text-sm text-slate-400">
          Powered by EduSphere Learning Intelligence
        </p>
      </div>
    </div>
  );
}

function RoleCard({ title, description, icon, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card 
        className="cursor-pointer border-none shadow-lg hover:shadow-xl transition-all h-full bg-white flex flex-col pt-4"
        onClick={onClick}
      >
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
          <CardDescription className="text-slate-500 min-h-[60px]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8 mt-auto">
          <Button variant="ghost" className="text-blue-600 group">
            Select Role
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
