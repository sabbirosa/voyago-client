import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Voyago ("we," "our," or "us") is committed to protecting your privacy. This
                  Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you use our platform and services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p>
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and photos</li>
                    <li>Payment information</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Usage Information</h3>
                  <p>
                    We automatically collect information about how you use our platform,
                    including:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Device information and IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Search queries and interactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We do not sell your personal information. We may share your information in
                  the following circumstances:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>With service providers who assist us in operating our platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your consent or at your direction</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We implement appropriate technical and organizational measures to protect
                  your personal information. However, no method of transmission over the
                  Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We use cookies and similar tracking technologies to track activity on our
                  platform. You can instruct your browser to refuse all cookies or to indicate
                  when a cookie is being sent. For more information, please see our{" "}
                  <a href="/cookies" className="text-primary hover:underline">
                    Cookie Policy
                  </a>
                  .
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-2">
                  Email: privacy@voyago.com<br />
                  Address: 123 Travel Street, San Francisco, CA 94102, United States
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

