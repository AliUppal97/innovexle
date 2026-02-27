"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  jobCode: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn: string;
  portfolio: string;
  currentCompany: string;
  currentTitle: string;
  yearsOfExperience: string;
  expectedSalary: string;
  noticePeriod: string;
  workAuthorization: string;
  coverLetter: string;
  heardAbout: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedIn: "",
  portfolio: "",
  currentCompany: "",
  currentTitle: "",
  yearsOfExperience: "",
  expectedSalary: "",
  noticePeriod: "",
  workAuthorization: "",
  coverLetter: "",
  heardAbout: "",
};

export function JobApplicationForm({ jobId, jobTitle, jobCode }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document.");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }
      setResumeFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create form data for API submission
      const apiFormData = new FormData();
      apiFormData.append("jobId", jobId);
      apiFormData.append("jobCode", jobCode);
      apiFormData.append("jobTitle", jobTitle);
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, value);
      });

      // Append resume file
      if (resumeFile) {
        apiFormData.append("resume", resumeFile);
      }

      // Submit to API
      const response = await fetch("/api/applications", {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit application");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-h2 font-bold text-foreground">
          Application Submitted!
        </h3>
        <p className="mt-4 text-body text-muted max-w-md mx-auto">
          Thank you for applying for the <strong>{jobTitle}</strong> position. We&apos;ve
          received your application and will review it shortly. Expect to hear from us
          within 5-7 business days.
        </p>
        <p className="mt-4 text-small text-muted">
          Application Reference: {jobCode}-{Date.now().toString(36).toUpperCase()}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" required>
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="lastName" required>
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                autoComplete="family-name"
              />
            </div>
            <div>
              <Label htmlFor="email" required>
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="phone" required>
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
                required
                autoComplete="tel"
              />
            </div>
          </div>
        </div>

        {/* Online Presence */}
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-4">
            Online Presence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="linkedIn">LinkedIn Profile</Label>
              <Input
                id="linkedIn"
                name="linkedIn"
                type="url"
                value={formData.linkedIn}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio / GitHub</Label>
              <Input
                id="portfolio"
                name="portfolio"
                type="url"
                value={formData.portfolio}
                onChange={handleInputChange}
                placeholder="https://github.com/johndoe"
              />
            </div>
          </div>
        </div>

        {/* Professional Experience */}
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-4">
            Professional Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="currentCompany">Current Company</Label>
              <Input
                id="currentCompany"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleInputChange}
                placeholder="Acme Inc."
                autoComplete="organization"
              />
            </div>
            <div>
              <Label htmlFor="currentTitle">Current Title</Label>
              <Input
                id="currentTitle"
                name="currentTitle"
                value={formData.currentTitle}
                onChange={handleInputChange}
                placeholder="Senior Software Engineer"
                autoComplete="organization-title"
              />
            </div>
            <div>
              <Label htmlFor="yearsOfExperience" required>
                Years of Experience
              </Label>
              <Select
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={(v) => setFormData((prev) => ({ ...prev, yearsOfExperience: v }))}
                options={[
                  { value: "0-1", label: "0-1 years" },
                  { value: "1-3", label: "1-3 years" },
                  { value: "3-5", label: "3-5 years" },
                  { value: "5-7", label: "5-7 years" },
                  { value: "7-10", label: "7-10 years" },
                  { value: "10+", label: "10+ years" },
                ]}
                placeholder="Select experience"
                required
              />
            </div>
            <div>
              <Label htmlFor="noticePeriod" required>
                Notice Period
              </Label>
              <Select
                id="noticePeriod"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={(v) => setFormData((prev) => ({ ...prev, noticePeriod: v }))}
                options={[
                  { value: "immediate", label: "Immediately available" },
                  { value: "2-weeks", label: "2 weeks" },
                  { value: "1-month", label: "1 month" },
                  { value: "2-months", label: "2 months" },
                  { value: "3-months", label: "3+ months" },
                ]}
                placeholder="Select notice period"
                required
              />
            </div>
          </div>
        </div>

        {/* Compensation & Authorization */}
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-4">
            Compensation & Work Authorization
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="expectedSalary">Expected Salary (USD/year)</Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                placeholder="e.g., 150,000 - 180,000"
              />
            </div>
            <div>
              <Label htmlFor="workAuthorization" required>
                Work Authorization
              </Label>
              <Select
                id="workAuthorization"
                name="workAuthorization"
                value={formData.workAuthorization}
                onChange={(v) => setFormData((prev) => ({ ...prev, workAuthorization: v }))}
                options={[
                  { value: "citizen", label: "US Citizen" },
                  { value: "permanent-resident", label: "Permanent Resident" },
                  { value: "visa-holder", label: "Visa Holder (H1B, L1, etc.)" },
                  { value: "authorized-other", label: "Authorized to work (Other)" },
                  { value: "requires-sponsorship", label: "Requires Sponsorship" },
                ]}
                placeholder="Select authorization"
                required
              />
            </div>
          </div>
        </div>

        {/* Resume Upload */}
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-4">
            Resume / CV
          </h3>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              resumeFile ? "border-accent bg-accent/5" : "border-border hover:border-muted"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume"
            />
            {resumeFile ? (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-body font-medium text-foreground">{resumeFile.name}</p>
                <p className="text-small text-muted">
                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-small text-accent hover:underline"
                >
                  Remove and upload different file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-body text-foreground">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-accent hover:underline font-medium"
                  >
                    Click to upload
                  </button>{" "}
                  or drag and drop
                </p>
                <p className="text-small text-muted">PDF or Word (max 5MB)</p>
              </div>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <h3 className="text-h3 font-semibold text-foreground mb-4">
            Cover Letter
          </h3>
          <Label htmlFor="coverLetter">
            Tell us why you&apos;re interested in this role
          </Label>
          <Textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            placeholder="Share what excites you about this opportunity, relevant experience, and what you'd bring to the team..."
            rows={6}
          />
        </div>

        {/* How did you hear about us */}
        <div>
          <Label htmlFor="heardAbout">How did you hear about this position?</Label>
          <Select
            id="heardAbout"
            name="heardAbout"
            value={formData.heardAbout}
            onChange={(v) => setFormData((prev) => ({ ...prev, heardAbout: v }))}
            options={[
              { value: "linkedin", label: "LinkedIn" },
              { value: "twitter", label: "Twitter / X" },
              { value: "referral", label: "Employee Referral" },
              { value: "job-board", label: "Job Board (Indeed, etc.)" },
              { value: "company-website", label: "Company Website" },
              { value: "other", label: "Other" },
            ]}
            placeholder="Select an option"
            allowEmpty
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive-muted border border-destructive-border">
            <p className="text-small text-destructive">{error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-small text-muted">
              By submitting, you agree to our{" "}
              <a href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <Button type="submit" size="lg" disabled={isSubmitting || !resumeFile}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
