import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Building2, 
  UserCog, 
  ArrowRight, 
  CheckCircle2,
  Users,
  Briefcase,
  TrendingUp,
  Shield,
  Zap,
  BarChart3
} from "lucide-react";

const Index = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && role) {
      if (role === "student") navigate("/student");
      else if (role === "company") navigate("/company");
      else if (role === "placement_head") navigate("/placement-head");
    }
  }, [user, role, navigate]);

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Complete student profiles with skills, projects, and resume management",
    },
    {
      icon: Briefcase,
      title: "Job Postings",
      description: "Companies can post opportunities with detailed eligibility criteria",
    },
    {
      icon: TrendingUp,
      title: "Application Tracking",
      description: "Track application status from submission to placement",
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Placement heads verify student profiles for company access",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant notifications for shortlisting and interview schedules",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track placement statistics and generate reports",
    },
  ];

  const roles = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Create your profile, browse opportunities, and apply for jobs that match your skills",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Building2,
      title: "Companies",
      description: "Post job openings, view student profiles, and manage your recruitment process",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: UserCog,
      title: "Placement Heads",
      description: "Manage the entire placement process, verify profiles, and track statistics",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center stagger-children">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm mb-6">
              <GraduationCap className="h-4 w-4" />
              <span>Campus Placements</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Your Gateway to
              <span className="block text-accent">Career Success</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              This Application connects students, colleges, and companies on one powerful platform. 
              Reduce friction, increase transparency, and accelerate hiring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
              >
                <Link to="/auth">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to make campus placements efficient and transparent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-6 rounded-xl bg-card border border-border shadow-smooth hover:shadow-xl transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored dashboards and features for each stakeholder in the placement process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <div key={index} className="role-card text-center">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${role.color} mb-6`}>
                  <role.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                  {role.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {role.description}
                </p>
                <ul className="text-sm text-left space-y-2">
                  {role.title === "Students" && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Profile & Resume Management</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Job Application Tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Interview Notifications</span>
                      </li>
                    </>
                  )}
                  {role.title === "Companies" && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Post Job Openings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Filter & Shortlist Candidates</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Schedule Interviews</span>
                      </li>
                    </>
                  )}
                  {role.title === "Placement Heads" && (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Student Verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Company Management</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Placement Analytics</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
