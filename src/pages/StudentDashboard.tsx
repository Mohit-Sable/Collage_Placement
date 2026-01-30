import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  GraduationCap,
  Briefcase,
  FileText,
  Bell,
  User,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar
} from "lucide-react";

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["studentProfile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: applications } = useQuery({
    queryKey: ["studentApplications", profile?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select(`
          *,
          job_postings (
            *,
            company_profiles (company_name, logo_url)
          )
        `)
        .eq("student_id", profile?.id);
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: availableJobs } = useQuery({
    queryKey: ["availableJobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("job_postings")
        .select(`
          *,
          company_profiles (company_name, logo_url, industry)
        `)
        .eq("is_active", true);
      return data || [];
    },
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      shortlisted: "bg-blue-100 text-blue-800",
      interview_scheduled: "bg-purple-100 text-purple-800",
      selected: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const navItems = [
    { path: "/student", label: "Dashboard", icon: GraduationCap },
  ];

  const queryClient = useQueryClient();
  const [skillInput, setSkillInput] = useState("");

  const updateSkillsMutation = useMutation({
    mutationFn: async (skills: string[]) => {
      await supabase
        .from("student_profiles")
        .update({ skills })
        .eq("id", profile.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentProfile"] });
      setSkillInput("");
    },
  });

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (profile?.skills?.includes(skillInput.trim())) return;

    updateSkillsMutation.mutate([
      ...(profile?.skills || []),
      skillInput.trim(),
    ]);
  };

  const removeSkill = (skill: string) => {
    updateSkillsMutation.mutate(
      profile.skills.filter((s: string) => s !== skill)
    );
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-semibold text-foreground">Placement Connect</h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || "Student"}! 👋
          </h2>
          <p className="text-muted-foreground">
            {profile?.is_verified
              ? "Your profile is verified. You can apply to all available positions."
              : "Your profile is pending verification by the placement office."}
          </p>
        </div>

        {/* Small Skills Input */}
        <div className="flex flex-wrap items-center gap-2 mt-2">

          <div className="flex items-center gap-2">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill"
              className="h-8 w-32 text-sm"
            />
            <Button size="sm" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {profile?.skills?.map((skill: string) => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div> <br />


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{availableJobs?.length || 0}</p>
                </div>
                <Briefcase className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground">{applications?.length || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications?.filter((a: any) => a.status === "shortlisted").length || 0}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Interviews</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications?.filter((a: any) => a.status === "interview_scheduled").length || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Recent Applications</CardTitle>
              <CardDescription>Track the status of your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{app.job_postings?.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {app.job_postings?.company_profiles?.company_name}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(app.status)}>
                        {app.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No applications yet</p>
                  <Link to="/student/jobs" className="text-accent hover:underline text-sm">
                    Browse available jobs
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Latest Job Openings</CardTitle>
              <CardDescription>New opportunities matching your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {availableJobs && availableJobs.length > 0 ? (
                <div className="space-y-4">
                  {availableJobs.slice(0, 5).map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.company_profiles?.company_name} • {job.salary_package}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No jobs available at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
