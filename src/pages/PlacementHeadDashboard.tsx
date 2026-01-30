import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// Comprehensive Mock Data for Local Testing
const mockStudents = [
  // Placed Students
  { id: "1", full_name: "Aarav Sharma", branch: "CSE", year_of_graduation: "2025", cgpa: "9.2", is_verified: true, is_placed: true, placed_company: "Google" },
  { id: "2", full_name: "Priya Patel", branch: "IT", year_of_graduation: "2025", cgpa: "9.0", is_verified: true, is_placed: true, placed_company: "Microsoft" },
  { id: "3", full_name: "Rahul Verma", branch: "CSE", year_of_graduation: "2025", cgpa: "8.8", is_verified: true, is_placed: true, placed_company: "Google" },
  { id: "4", full_name: "Sneha Reddy", branch: "ECE", year_of_graduation: "2025", cgpa: "8.9", is_verified: true, is_placed: true, placed_company: "Amazon" },
  { id: "5", full_name: "Arjun Singh", branch: "CSE", year_of_graduation: "2025", cgpa: "9.1", is_verified: true, is_placed: true, placed_company: "Microsoft" },
  { id: "6", full_name: "Ananya Gupta", branch: "IT", year_of_graduation: "2025", cgpa: "8.7", is_verified: true, is_placed: true, placed_company: "Infosys" },
  { id: "7", full_name: "Vikram Kumar", branch: "CSE", year_of_graduation: "2025", cgpa: "8.6", is_verified: true, is_placed: true, placed_company: "TCS" },
  { id: "8", full_name: "Ishita Joshi", branch: "ECE", year_of_graduation: "2025", cgpa: "8.8", is_verified: true, is_placed: true, placed_company: "Amazon" },
  { id: "9", full_name: "Karthik Nair", branch: "CSE", year_of_graduation: "2025", cgpa: "9.3", is_verified: true, is_placed: true, placed_company: "Google" },
  { id: "10", full_name: "Diya Mehta", branch: "IT", year_of_graduation: "2025", cgpa: "8.9", is_verified: true, is_placed: true, placed_company: "Wipro" },
  { id: "11", full_name: "Rohan Das", branch: "CSE", year_of_graduation: "2025", cgpa: "8.5", is_verified: true, is_placed: true, placed_company: "Infosys" },
  { id: "12", full_name: "Kavya Iyer", branch: "ECE", year_of_graduation: "2025", cgpa: "8.7", is_verified: true, is_placed: true, placed_company: "Wipro" },
  { id: "13", full_name: "Aditya Rao", branch: "CSE", year_of_graduation: "2025", cgpa: "9.0", is_verified: true, is_placed: true, placed_company: "Microsoft" },
  { id: "14", full_name: "Riya Desai", branch: "IT", year_of_graduation: "2025", cgpa: "8.8", is_verified: true, is_placed: true, placed_company: "TCS" },
  { id: "15", full_name: "Siddharth Pillai", branch: "CSE", year_of_graduation: "2025", cgpa: "8.4", is_verified: true, is_placed: true, placed_company: "Amazon" },
  { id: "16", full_name: "Anjali Malhotra", branch: "ECE", year_of_graduation: "2025", cgpa: "8.6", is_verified: true, is_placed: true, placed_company: "Accenture" },
  { id: "17", full_name: "Varun Kapoor", branch: "CSE", year_of_graduation: "2025", cgpa: "8.9", is_verified: true, is_placed: true, placed_company: "Cognizant" },
  { id: "18", full_name: "Meera Bhat", branch: "IT", year_of_graduation: "2025", cgpa: "9.1", is_verified: true, is_placed: true, placed_company: "Microsoft" },
  { id: "19", full_name: "Nikhil Agarwal", branch: "CSE", year_of_graduation: "2025", cgpa: "8.7", is_verified: true, is_placed: true, placed_company: "TCS" },
  { id: "20", full_name: "Pooja Saxena", branch: "ECE", year_of_graduation: "2025", cgpa: "8.5", is_verified: true, is_placed: true, placed_company: "Infosys" },

  // Unplaced/In-Process Students
  { id: "21", full_name: "Abhishek Pandey", branch: "CSE", year_of_graduation: "2025", cgpa: "7.8", is_verified: true, is_placed: false, placed_company: null },
  { id: "22", full_name: "Neha Chauhan", branch: "IT", year_of_graduation: "2025", cgpa: "8.1", is_verified: true, is_placed: false, placed_company: null },
  { id: "23", full_name: "Harsh Mishra", branch: "ECE", year_of_graduation: "2025", cgpa: "7.9", is_verified: true, is_placed: false, placed_company: null },
  { id: "24", full_name: "Simran Kaur", branch: "CSE", year_of_graduation: "2025", cgpa: "8.2", is_verified: true, is_placed: false, placed_company: null },
  { id: "25", full_name: "Manish Thakur", branch: "IT", year_of_graduation: "2025", cgpa: "7.7", is_verified: false, is_placed: false, placed_company: null },
  { id: "26", full_name: "Tanvi Bhatt", branch: "CSE", year_of_graduation: "2025", cgpa: "8.0", is_verified: false, is_placed: false, placed_company: null },
  { id: "27", full_name: "Yash Sinha", branch: "ECE", year_of_graduation: "2025", cgpa: "7.6", is_verified: true, is_placed: false, placed_company: null },
  { id: "28", full_name: "Kriti Shah", branch: "IT", year_of_graduation: "2025", cgpa: "8.3", is_verified: true, is_placed: false, placed_company: null },
  { id: "29", full_name: "Gaurav Jain", branch: "CSE", year_of_graduation: "2025", cgpa: "7.9", is_verified: false, is_placed: false, placed_company: null },
  { id: "30", full_name: "Shreya Bansal", branch: "ECE", year_of_graduation: "2025", cgpa: "8.1", is_verified: true, is_placed: false, placed_company: null },
];

const mockCompanies = [
  { id: "1", company_name: "Google", industry: "Technology", email: "hr@google.com", is_verified: true },
  { id: "2", company_name: "Microsoft", industry: "Technology", email: "careers@microsoft.com", is_verified: true },
  { id: "3", company_name: "Amazon", industry: "E-commerce & Cloud", email: "recruiting@amazon.com", is_verified: true },
  { id: "4", company_name: "TCS", industry: "IT Services", email: "recruitment@tcs.com", is_verified: true },
  { id: "5", company_name: "Infosys", industry: "IT Services", email: "careers@infosys.com", is_verified: true },
  { id: "6", company_name: "Wipro", industry: "IT Services", email: "talent@wipro.com", is_verified: true },
  { id: "7", company_name: "Cognizant", industry: "IT Consulting", email: "hiring@cognizant.com", is_verified: true },
  { id: "8", company_name: "Accenture", industry: "Consulting", email: "jobs@accenture.com", is_verified: true },
  { id: "9", company_name: "Apple", industry: "Technology", email: "hr@apple.com", is_verified: false },
  { id: "10", company_name: "Meta", industry: "Social Media", email: "careers@meta.com", is_verified: false },
];

const mockJobs = [
  { id: "1", title: "Software Engineer", is_active: true, company_profiles: { company_name: "Google" } },
  { id: "2", title: "Cloud Solutions Architect", is_active: true, company_profiles: { company_name: "Microsoft" } },
  { id: "3", title: "AWS DevOps Engineer", is_active: true, company_profiles: { company_name: "Amazon" } },
  { id: "4", title: "Full Stack Developer", is_active: true, company_profiles: { company_name: "TCS" } },
  { id: "5", title: "Software Developer", is_active: true, company_profiles: { company_name: "Infosys" } },
  { id: "6", title: "Java Developer", is_active: true, company_profiles: { company_name: "Wipro" } },
  { id: "7", title: "Data Engineer", is_active: true, company_profiles: { company_name: "Cognizant" } },
  { id: "8", title: "Technology Analyst", is_active: true, company_profiles: { company_name: "Accenture" } },
  { id: "9", title: "Backend Developer", is_active: true, company_profiles: { company_name: "Google" } },
  { id: "10", title: ".NET Developer", is_active: true, company_profiles: { company_name: "Microsoft" } },
  { id: "11", title: "ML Engineer", is_active: false, company_profiles: { company_name: "Google" } },
  { id: "12", title: "Frontend Developer", is_active: true, company_profiles: { company_name: "Amazon" } },
  { id: "13", title: "Systems Engineer", is_active: true, company_profiles: { company_name: "TCS" } },
  { id: "14", title: "Digital Specialist", is_active: false, company_profiles: { company_name: "Infosys" } },
];

const mockApplications = [
  // Google Applications (3 placed, 2 in-process)
  { id: "1", status: "accepted", student_profiles: { full_name: "Aarav Sharma", email: "aarav@college.edu", branch: "CSE", is_placed: true, placed_company: "Google" }, job_postings: { title: "Software Engineer", company_profiles: { company_name: "Google" } } },
  { id: "2", status: "accepted", student_profiles: { full_name: "Rahul Verma", email: "rahul@college.edu", branch: "CSE", is_placed: true, placed_company: "Google" }, job_postings: { title: "Software Engineer", company_profiles: { company_name: "Google" } } },
  { id: "3", status: "accepted", student_profiles: { full_name: "Karthik Nair", email: "karthik@college.edu", branch: "CSE", is_placed: true, placed_company: "Google" }, job_postings: { title: "Backend Developer", company_profiles: { company_name: "Google" } } },
  { id: "4", status: "under_review", student_profiles: { full_name: "Abhishek Pandey", email: "abhishek@college.edu", branch: "CSE", is_placed: false, placed_company: null }, job_postings: { title: "Software Engineer", company_profiles: { company_name: "Google" } } },
  { id: "5", status: "applied", student_profiles: { full_name: "Simran Kaur", email: "simran@college.edu", branch: "CSE", is_placed: false, placed_company: null }, job_postings: { title: "Backend Developer", company_profiles: { company_name: "Google" } } },

  // Microsoft Applications (4 placed, 3 in-process)
  { id: "6", status: "accepted", student_profiles: { full_name: "Priya Patel", email: "priya@college.edu", branch: "IT", is_placed: true, placed_company: "Microsoft" }, job_postings: { title: "Cloud Solutions Architect", company_profiles: { company_name: "Microsoft" } } },
  { id: "7", status: "accepted", student_profiles: { full_name: "Arjun Singh", email: "arjun@college.edu", branch: "CSE", is_placed: true, placed_company: "Microsoft" }, job_postings: { title: "Cloud Solutions Architect", company_profiles: { company_name: "Microsoft" } } },
  { id: "8", status: "accepted", student_profiles: { full_name: "Aditya Rao", email: "aditya@college.edu", branch: "CSE", is_placed: true, placed_company: "Microsoft" }, job_postings: { title: ".NET Developer", company_profiles: { company_name: "Microsoft" } } },
  { id: "9", status: "accepted", student_profiles: { full_name: "Meera Bhat", email: "meera@college.edu", branch: "IT", is_placed: true, placed_company: "Microsoft" }, job_postings: { title: "Cloud Solutions Architect", company_profiles: { company_name: "Microsoft" } } },
  { id: "10", status: "under_review", student_profiles: { full_name: "Neha Chauhan", email: "neha@college.edu", branch: "IT", is_placed: false, placed_company: null }, job_postings: { title: "Cloud Solutions Architect", company_profiles: { company_name: "Microsoft" } } },
  { id: "11", status: "applied", student_profiles: { full_name: "Kriti Shah", email: "kriti@college.edu", branch: "IT", is_placed: false, placed_company: null }, job_postings: { title: ".NET Developer", company_profiles: { company_name: "Microsoft" } } },
  { id: "12", status: "under_review", student_profiles: { full_name: "Manish Thakur", email: "manish@college.edu", branch: "IT", is_placed: false, placed_company: null }, job_postings: { title: "Cloud Solutions Architect", company_profiles: { company_name: "Microsoft" } } },

  // Amazon Applications (3 placed, 2 in-process)
  { id: "13", status: "accepted", student_profiles: { full_name: "Sneha Reddy", email: "sneha@college.edu", branch: "ECE", is_placed: true, placed_company: "Amazon" }, job_postings: { title: "AWS DevOps Engineer", company_profiles: { company_name: "Amazon" } } },
  { id: "14", status: "accepted", student_profiles: { full_name: "Ishita Joshi", email: "ishita@college.edu", branch: "ECE", is_placed: true, placed_company: "Amazon" }, job_postings: { title: "AWS DevOps Engineer", company_profiles: { company_name: "Amazon" } } },
  { id: "15", status: "accepted", student_profiles: { full_name: "Siddharth Pillai", email: "siddharth@college.edu", branch: "CSE", is_placed: true, placed_company: "Amazon" }, job_postings: { title: "Frontend Developer", company_profiles: { company_name: "Amazon" } } },
  { id: "16", status: "applied", student_profiles: { full_name: "Harsh Mishra", email: "harsh@college.edu", branch: "ECE", is_placed: false, placed_company: null }, job_postings: { title: "AWS DevOps Engineer", company_profiles: { company_name: "Amazon" } } },
  { id: "17", status: "under_review", student_profiles: { full_name: "Yash Sinha", email: "yash@college.edu", branch: "ECE", is_placed: false, placed_company: null }, job_postings: { title: "Frontend Developer", company_profiles: { company_name: "Amazon" } } },

  // TCS Applications (3 placed, 1 in-process)
  { id: "18", status: "accepted", student_profiles: { full_name: "Vikram Kumar", email: "vikram@college.edu", branch: "CSE", is_placed: true, placed_company: "TCS" }, job_postings: { title: "Full Stack Developer", company_profiles: { company_name: "TCS" } } },
  { id: "19", status: "accepted", student_profiles: { full_name: "Riya Desai", email: "riya@college.edu", branch: "IT", is_placed: true, placed_company: "TCS" }, job_postings: { title: "Systems Engineer", company_profiles: { company_name: "TCS" } } },
  { id: "20", status: "accepted", student_profiles: { full_name: "Nikhil Agarwal", email: "nikhil@college.edu", branch: "CSE", is_placed: true, placed_company: "TCS" }, job_postings: { title: "Full Stack Developer", company_profiles: { company_name: "TCS" } } },
  { id: "21", status: "applied", student_profiles: { full_name: "Tanvi Bhatt", email: "tanvi@college.edu", branch: "CSE", is_placed: false, placed_company: null }, job_postings: { title: "Systems Engineer", company_profiles: { company_name: "TCS" } } },

  // Infosys Applications (3 placed, 1 in-process)
  { id: "22", status: "accepted", student_profiles: { full_name: "Ananya Gupta", email: "ananya@college.edu", branch: "IT", is_placed: true, placed_company: "Infosys" }, job_postings: { title: "Software Developer", company_profiles: { company_name: "Infosys" } } },
  { id: "23", status: "accepted", student_profiles: { full_name: "Rohan Das", email: "rohan@college.edu", branch: "CSE", is_placed: true, placed_company: "Infosys" }, job_postings: { title: "Software Developer", company_profiles: { company_name: "Infosys" } } },
  { id: "24", status: "accepted", student_profiles: { full_name: "Pooja Saxena", email: "pooja@college.edu", branch: "ECE", is_placed: true, placed_company: "Infosys" }, job_postings: { title: "Software Developer", company_profiles: { company_name: "Infosys" } } },
  { id: "25", status: "under_review", student_profiles: { full_name: "Shreya Bansal", email: "shreya@college.edu", branch: "ECE", is_placed: false, placed_company: null }, job_postings: { title: "Software Developer", company_profiles: { company_name: "Infosys" } } },

  // Wipro Applications (2 placed, 1 in-process)
  { id: "26", status: "accepted", student_profiles: { full_name: "Diya Mehta", email: "diya@college.edu", branch: "IT", is_placed: true, placed_company: "Wipro" }, job_postings: { title: "Java Developer", company_profiles: { company_name: "Wipro" } } },
  { id: "27", status: "accepted", student_profiles: { full_name: "Kavya Iyer", email: "kavya@college.edu", branch: "ECE", is_placed: true, placed_company: "Wipro" }, job_postings: { title: "Java Developer", company_profiles: { company_name: "Wipro" } } },
  { id: "28", status: "applied", student_profiles: { full_name: "Gaurav Jain", email: "gaurav@college.edu", branch: "CSE", is_placed: false, placed_company: null }, job_postings: { title: "Java Developer", company_profiles: { company_name: "Wipro" } } },

  // Cognizant Applications (1 placed)
  { id: "29", status: "accepted", student_profiles: { full_name: "Varun Kapoor", email: "varun@college.edu", branch: "CSE", is_placed: true, placed_company: "Cognizant" }, job_postings: { title: "Data Engineer", company_profiles: { company_name: "Cognizant" } } },

  // Accenture Applications (1 placed)
  { id: "30", status: "accepted", student_profiles: { full_name: "Anjali Malhotra", email: "anjali@college.edu", branch: "ECE", is_placed: true, placed_company: "Accenture" }, job_postings: { title: "Technology Analyst", company_profiles: { company_name: "Accenture" } } },
];

// Simple UI Components (inline replacements)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "default", size = "default", disabled = false }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = variant === "ghost"
    ? "hover:bg-gray-100 text-gray-700"
    : variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : size === "icon" ? "p-2" : "px-4 py-2";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variantClasses = variant === "outline"
    ? "border border-gray-300 bg-white text-gray-700"
    : "bg-blue-100 text-blue-800";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

const Input = ({ value, onChange, placeholder, required, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder, rows, required, className = "" }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    required={required}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Label = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>{children}</label>
);

// Icons (simple SVG replacements)
const Icons = {
  UserCog: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Building2: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Bell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  CheckCircle2: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  TrendingUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Megaphone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  BarChart3: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
};

const PlacementHeadDashboard = () => {
  const { signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    target_audience: "",
  });

  const students = mockStudents;
  const companies = mockCompanies;
  const jobs = mockJobs;
  const applications = mockApplications;

  // Calculate placement statistics by company
  const placementStatsByCompany = useMemo(() => {
    if (!applications || !students) return [];

    const companyStats = new Map();

    applications.forEach((app) => {
      const companyName = app.job_postings?.company_profiles?.company_name;
      if (companyName && !companyStats.has(companyName)) {
        companyStats.set(companyName, {
          company: companyName,
          placed: 0,
          unplaced: 0,
        });
      }
    });

    applications.forEach((app) => {
      const companyName = app.job_postings?.company_profiles?.company_name;
      const student = app.student_profiles;

      if (companyName && student) {
        const stats = companyStats.get(companyName);

        if (student.is_placed && student.placed_company === companyName) {
          stats.placed++;
        } else if (app.status === 'applied' || app.status === 'under_review') {
          stats.unplaced++;
        }
      }
    });

    return Array.from(companyStats.values())
      .filter(stat => stat.placed > 0 || stat.unplaced > 0)
      .sort((a, b) => (b.placed + b.unplaced) - (a.placed + a.unplaced))
      .slice(0, 10);
  }, [applications, students]);

  const handleVerifyStudent = (id, verified) => {
    console.log(`Verifying student ${id}:`, verified);
    alert(`Student ${verified ? 'verified' : 'unverified'} successfully!`);
  };

  const handleVerifyCompany = (id, verified) => {
    console.log(`Verifying company ${id}:`, verified);
    alert(`Company ${verified ? 'verified' : 'unverified'} successfully!`);
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    console.log("Creating announcement:", newAnnouncement);
    alert("Announcement created successfully!");
    setIsAnnouncementDialogOpen(false);
    setNewAnnouncement({ title: "", content: "", target_audience: "" });
  };

  const navItems = [
    { path: "dashboard", label: "Dashboard", icon: Icons.UserCog },

  ];

  const placedStudents = students?.filter((s) => s.is_placed).length || 0;
  const verifiedStudents = students?.filter((s) => s.is_verified).length || 0;
  const activeJobs = jobs?.filter((j) => j.is_active).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Icons.UserCog />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Placement Connect</h1>
              <p className="text-xs text-gray-600">Placement Head Portal</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setCurrentPage(item.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  {item.label}
                </div>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icons.Bell />
            </Button>
            <Button variant="ghost" className="gap-2" onClick={signOut}>
              <Icons.LogOut />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Placement Head
            </h2>
            <p className="text-gray-600">
              Here's an overview of the placement activities
            </p>
          </div>

          <Button className="gap-2" onClick={() => setIsAnnouncementDialogOpen(!isAnnouncementDialogOpen)}>
            <Icons.Megaphone />
            Create Announcement
          </Button>
        </div>

        {/* Announcement Dialog */}
        {isAnnouncementDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-2">Create New Announcement</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share important updates with students and companies
              </p>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
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
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Everyone</option>
                    <option value="student">Students Only</option>
                    <option value="company">Companies Only</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Create Announcement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAnnouncementDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{students?.length || 0}</p>
                  <p className="text-xs text-green-600 mt-1">{verifiedStudents} verified</p>
                </div>
                <div className="text-blue-600">
                  <Icons.Users />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{companies?.length || 0}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {companies?.filter((c) => c.is_verified).length || 0} verified
                  </p>
                </div>
                <div className="text-blue-500">
                  <Icons.Building2 />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeJobs}</p>
                  <p className="text-xs text-gray-600 mt-1">{jobs?.length || 0} total</p>
                </div>
                <div className="text-purple-500">
                  <Icons.Briefcase />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students Placed</p>
                  <p className="text-2xl font-bold text-gray-900">{placedStudents}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {students?.length ? Math.round((placedStudents / students.length) * 100) : 0}% placement rate
                  </p>
                </div>
                <div className="text-green-600">
                  <Icons.TrendingUp />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placement Statistics - Company Details and Graph */}
        <div className="mb-8">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="text-blue-600">
                <Icons.BarChart3 />
              </div>
              Company Placement Statistics
            </h3>
            <p className="text-gray-600 mt-1">
              Detailed overview of student placements across companies
            </p>
          </div>

          {placementStatsByCompany.length > 0 ? (
            <div className="grid lg:grid-cols-[400px,1fr] gap-6">
              {/* Left Side - Company Details List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Companies Visited</CardTitle>
                  <CardDescription>
                    {placementStatsByCompany.length} companies with active recruitment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {placementStatsByCompany.map((stat, index) => (
                      <div
                        key={stat.company}
                        className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                              <Icons.Building2 />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{stat.company}</p>
                              <p className="text-xs text-gray-600">
                                Total Students: {stat.placed + stat.unplaced}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-green-600">
                                <Icons.CheckCircle2 />
                              </div>
                              <span className="text-xs font-medium text-green-700">Placed</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.placed}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {stat.placed + stat.unplaced > 0
                                ? `${Math.round((stat.placed / (stat.placed + stat.unplaced)) * 100)}%`
                                : '0%'
                              } success rate
                            </p>
                          </div>

                          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-amber-600">
                                <Icons.Users />
                              </div>
                              <span className="text-xs font-medium text-amber-700">In Process</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.unplaced}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              Applied/Review
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Right Side - Graph */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visual Analytics</CardTitle>
                  <CardDescription>
                    Comparative view of placement statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                      data={placementStatsByCompany}
                      margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="company"
                        angle={-45}
                        textAnchor="end"
                        height={120}
                        interval={0}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value, name) => {
                          const label = name === 'placed' ? 'Placed Students' : 'Applied/Under Review';
                          return [value, label];
                        }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                      />
                      <Bar
                        dataKey="placed"
                        fill="#22c55e"
                        name="Placed Students"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="unplaced"
                        fill="#f59e0b"
                        name="Applied/Under Review"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Companies</p>
                      <p className="text-2xl font-bold text-gray-900">{placementStatsByCompany.length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Placed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {placementStatsByCompany.reduce((sum, stat) => sum + stat.placed, 0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">In Process</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {placementStatsByCompany.reduce((sum, stat) => sum + stat.unplaced, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-gray-600">
                  <div className="mx-auto mb-4 text-gray-400">
                    <Icons.BarChart3 />
                  </div>
                  <p className="text-lg font-medium">No placement data available yet</p>
                  <p className="text-sm mt-2">Data will appear once students start applying to jobs</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pending Verifications */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="text-amber-600">
                  <Icons.Shield />
                </div>
                Pending Student Verifications
              </CardTitle>
              <CardDescription>Review and verify student profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {students?.filter((s) => !s.is_verified).length > 0 ? (
                <div className="space-y-4">
                  {students
                    .filter((s) => !s.is_verified)
                    .slice(0, 5)
                    .map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Icons.Users />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.full_name}</p>
                            <p className="text-sm text-gray-600">
                              {student.branch} • {student.year_of_graduation} • CGPA: {student.cgpa || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleVerifyStudent(student.id, true)}
                          >
                            <Icons.CheckCircle2 />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <div className="mx-auto mb-3 text-gray-400">
                    <Icons.CheckCircle2 />
                  </div>
                  <p>All students are verified!</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="text-amber-600">
                  <Icons.Building2 />
                </div>
                Pending Company Verifications
              </CardTitle>
              <CardDescription>Review and verify company profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {companies?.filter((c) => !c.is_verified).length > 0 ? (
                <div className="space-y-4">
                  {companies
                    .filter((c) => !c.is_verified)
                    .slice(0, 5)
                    .map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <Icons.Building2 />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{company.company_name}</p>
                            <p className="text-sm text-gray-600">
                              {company.industry} • {company.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleVerifyCompany(company.id, true)}
                          >
                            <Icons.CheckCircle2 />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <div className="mx-auto mb-3 text-gray-400">
                    <Icons.CheckCircle2 />
                  </div>
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