import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  UserCog, 
  Users, 
  Building2, 
  Briefcase, 
  Bell, 
  LogOut,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Megaphone,
  Plus,
  Shield
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PlacementHeadDashboard = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  // Announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    target_audience: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["placementHeadProfile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("placement_head_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: students } = useQuery({
    queryKey: ["allStudents"],
    queryFn: async () => {
      const { data } = await supabase
        .from("student_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: companies } = useQuery({
    queryKey: ["allCompanies"],
    queryFn: async () => {
      const { data } = await supabase
        .from("company_profiles")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: jobs } = useQuery({
    queryKey: ["allJobs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("job_postings")
        .select(`
          *,
          company_profiles (company_name)
        `)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: applications } = useQuery({
    queryKey: ["allApplications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select(`
          *,
          student_profiles (full_name, email, branch),
          job_postings (title, company_profiles (company_name))
        `);
      return data || [];
    },
  });

  const verifyStudentMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from("student_profiles")
        .update({ is_verified: verified })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStudents"] });
      toast({ title: "Student verification updated" });
    },
  });

  const verifyCompanyMutation = useMutation({
    mutationFn: async ({ id, verified }: { id: string; verified: boolean }) => {
      const { error } = await supabase
        .from("company_profiles")
        .update({ is_verified: verified })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCompanies"] });
      toast({ title: "Company verification updated" });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from("announcements").insert({
        title: data.title,
        content: data.content,
        target_audience: data.target_audience || null,
        created_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setIsAnnouncementDialogOpen(false);
      setNewAnnouncement({ title: "", content: "", target_audience: "" });
      toast({
        title: "Announcement created!",
        description: "All relevant users will be notified.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating announcement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const navItems = [
    { path: "/placement-head", label: "Dashboard", icon: UserCog },
    { path: "/placement-head/students", label: "Students", icon: Users },
    { path: "/placement-head/companies", label: "Companies", icon: Building2 },
    { path: "/placement-head/jobs", label: "Jobs", icon: Briefcase },
  ];

  const placedStudents = students?.filter((s: any) => s.is_placed).length || 0;
  const verifiedStudents = students?.filter((s: any) => s.is_verified).length || 0;
  const activeJobs = jobs?.filter((j: any) => j.is_active).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <UserCog className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-semibold text-foreground">Placement Connect</h1>
              <p className="text-xs text-muted-foreground">Placement Head Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Welcome, {profile?.full_name || "Admin"}! 🎓
            </h2>
            <p className="text-muted-foreground">
              Manage placements, verify profiles, and track statistics
            </p>
          </div>

          <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Megaphone className="h-4 w-4 mr-2" />
                New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>
                  Send a message to students, companies, or everyone
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createAnnouncementMutation.mutate(newAnnouncement);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="Important Update"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    placeholder="Announcement content..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <select
                    value={newAnnouncement.target_audience}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target_audience: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="">Everyone</option>
                    <option value="student">Students Only</option>
                    <option value="company">Companies Only</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" disabled={createAnnouncementMutation.isPending}>
                  {createAnnouncementMutation.isPending ? "Creating..." : "Create Announcement"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">{students?.length || 0}</p>
                  <p className="text-xs text-success mt-1">{verifiedStudents} verified</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Companies</p>
                  <p className="text-2xl font-bold text-foreground">{companies?.length || 0}</p>
                  <p className="text-xs text-success mt-1">
                    {companies?.filter((c: any) => c.is_verified).length || 0} verified
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold text-foreground">{activeJobs}</p>
                  <p className="text-xs text-muted-foreground mt-1">{jobs?.length || 0} total</p>
                </div>
                <Briefcase className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Students Placed</p>
                  <p className="text-2xl font-bold text-foreground">{placedStudents}</p>
                  <p className="text-xs text-success mt-1">
                    {students?.length ? Math.round((placedStudents / students.length) * 100) : 0}% placement rate
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Verifications */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Shield className="h-5 w-5 text-warning" />
                Pending Student Verifications
              </CardTitle>
              <CardDescription>Review and verify student profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {students?.filter((s: any) => !s.is_verified).length > 0 ? (
                <div className="space-y-4">
                  {students
                    .filter((s: any) => !s.is_verified)
                    .slice(0, 5)
                    .map((student: any) => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.branch} • {student.year_of_graduation} • CGPA: {student.cgpa || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success/10"
                            onClick={() => verifyStudentMutation.mutate({ id: student.id, verified: true })}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>All students are verified!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Building2 className="h-5 w-5 text-warning" />
                Pending Company Verifications
              </CardTitle>
              <CardDescription>Review and verify company profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {companies?.filter((c: any) => !c.is_verified).length > 0 ? (
                <div className="space-y-4">
                  {companies
                    .filter((c: any) => !c.is_verified)
                    .slice(0, 5)
                    .map((company: any) => (
                      <div key={company.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{company.company_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {company.industry} • {company.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success/10"
                            onClick={() => verifyCompanyMutation.mutate({ id: company.id, verified: true })}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>All companies are verified!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PlacementHeadDashboard;
