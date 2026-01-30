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
  Building2,
  Briefcase,
  Users,
  Bell,
  LogOut,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CompanyDashboard = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);

  // New job form state
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    required_skills: "",
    min_cgpa: "",
    eligible_branches: "",
    graduation_year: "",
    salary_package: "",
    openings: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["companyProfile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: jobPostings } = useQuery({
    queryKey: ["companyJobs", profile?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("job_postings")
        .select("*")
        .eq("company_id", profile?.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const { data: applications } = useQuery({
    queryKey: ["companyApplications", profile?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("applications")
        .select(`
          *,
          student_profiles (full_name, email, branch, cgpa, skills),
          job_postings!inner (title, company_id)
        `)
        .eq("job_postings.company_id", profile?.id);
      return data || [];
    },
    enabled: !!profile?.id,
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: any) => {
      const { error } = await supabase.from("job_postings").insert({
        company_id: profile?.id,
        title: jobData.title,
        description: jobData.description,
        required_skills: jobData.required_skills.split(",").map((s: string) => s.trim()),
        min_cgpa: parseFloat(jobData.min_cgpa) || 0,
        eligible_branches: jobData.eligible_branches.split(",").map((s: string) => s.trim()),
        graduation_year: parseInt(jobData.graduation_year) || null,
        salary_package: jobData.salary_package,
        openings: parseInt(jobData.openings) || 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
      setIsJobDialogOpen(false);
      setNewJob({
        title: "",
        description: "",
        required_skills: "",
        min_cgpa: "",
        eligible_branches: "",
        graduation_year: "",
        salary_package: "",
        openings: "",
      });
      toast({
        title: "Job posted successfully!",
        description: "Students can now view and apply for this position.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error posting job",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  type ApplicationStatus = "pending" | "shortlisted" | "interview_scheduled" | "selected" | "rejected";

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyApplications"] });
      toast({ title: "Application status updated" });
    },
  });

  const navItems = [
    { path: "/company", label: "Dashboard", icon: Building2 },

  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-semibold text-foreground">Placement Connect</h1>
              <p className="text-xs text-muted-foreground">Company Portal</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Welcome, {profile?.company_name || "Company"}! 🏢
            </h2>
            <p className="text-muted-foreground">
              {profile?.is_verified
                ? "Your company profile is verified. You can view student profiles and post jobs."
                : "Your profile is pending verification by the placement office."}
            </p>
          </div>

          <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new job opening
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createJobMutation.mutate(newJob);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-desc">Description</Label>
                  <Textarea
                    id="job-desc"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Job responsibilities, requirements..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Package</Label>
                    <Input
                      id="salary"
                      value={newJob.salary_package}
                      onChange={(e) => setNewJob({ ...newJob, salary_package: e.target.value })}
                      placeholder="₹10-15 LPA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openings">Openings</Label>
                    <Input
                      id="openings"
                      type="number"
                      value={newJob.openings}
                      onChange={(e) => setNewJob({ ...newJob, openings: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={newJob.required_skills}
                    onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">Minimum CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.1"
                      value={newJob.min_cgpa}
                      onChange={(e) => setNewJob({ ...newJob, min_cgpa: e.target.value })}
                      placeholder="7.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Graduation Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newJob.graduation_year}
                      onChange={(e) => setNewJob({ ...newJob, graduation_year: e.target.value })}
                      placeholder="2025"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branches">Eligible Branches (comma-separated)</Label>
                  <Input
                    id="branches"
                    value={newJob.eligible_branches}
                    onChange={(e) => setNewJob({ ...newJob, eligible_branches: e.target.value })}
                    placeholder="CSE, IT, ECE"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createJobMutation.isPending}>
                  {createJobMutation.isPending ? "Posting..." : "Post Job"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {jobPostings?.filter((j: any) => j.is_active).length || 0}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
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
                  <p className="text-sm text-muted-foreground">Selected</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications?.filter((a: any) => a.status === "selected").length || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Recent Applications</CardTitle>
              <CardDescription>Review and manage candidate applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications && applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{app.student_profiles?.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {app.job_postings?.title} • CGPA: {app.student_profiles?.cgpa}
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
                  <p>No applications received yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading">Your Job Postings</CardTitle>
              <CardDescription>Manage your active job listings</CardDescription>
            </CardHeader>
            <CardContent>
              {jobPostings && jobPostings.length > 0 ? (
                <div className="space-y-4">
                  {jobPostings.slice(0, 5).map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.openings} openings • {job.salary_package}
                          </p>
                        </div>
                      </div>
                      <Badge variant={job.is_active ? "default" : "secondary"}>
                        {job.is_active ? "Active" : "Closed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No job postings yet</p>
                  <Button
                    variant="link"
                    onClick={() => setIsJobDialogOpen(true)}
                    className="text-accent"
                  >
                    Create your first job posting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
