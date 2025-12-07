"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Book, HelpCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function GuideSupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual support form submission
    setTimeout(() => {
      toast.success("Thank you for contacting support! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const faqs = [
    {
      question: "How do I get verified as a guide?",
      answer:
        "To get verified, complete your profile, submit required documentation, and pass our verification process. This typically takes 2-3 business days.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Payments are processed automatically after each completed tour. Funds are transferred to your registered payment method within 5-7 business days.",
    },
    {
      question: "What if a traveler cancels?",
      answer:
        "Cancellation policies vary by tour. You can set your own cancellation terms when creating a listing. Voyago will handle cancellations according to your specified policy.",
    },
    {
      question: "How do I handle disputes?",
      answer:
        "Contact our support team immediately if you encounter any issues. We have a dispute resolution process to help resolve conflicts fairly.",
    },
    {
      question: "Can I offer multiple tours?",
      answer:
        "Yes! You can create multiple listings for different tours, experiences, or destinations. There's no limit to the number of tours you can offer.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Guide Support</h1>
            <p className="text-xl text-muted-foreground">
              We're here to help you succeed as a Voyago guide
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </div>
                <CardDescription>
                  Get instant help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </div>
                <CardDescription>
                  Send us a message and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <a href="mailto:guides@voyago.com">guides@voyago.com</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Phone Support</CardTitle>
                </div>
                <CardDescription>
                  Call us Monday-Friday, 9 AM - 6 PM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" asChild>
                  <a href="tel:+15551234567">+1 (555) 123-4567</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/guide/resources">
                    <Book className="mr-2 h-4 w-4" />
                    View Full Guide Resources
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and our support team will get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What can we help with?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your question or issue..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/guide/resources" className="text-primary hover:underline">
                  → Guide Resources & Documentation
                </Link>
                <Link href="/dashboard/listings" className="text-primary hover:underline">
                  → Manage Your Listings
                </Link>
                <Link href="/dashboard/guide/bookings" className="text-primary hover:underline">
                  → View Your Bookings
                </Link>
                <Link href="/dashboard/profile" className="text-primary hover:underline">
                  → Update Your Profile
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

