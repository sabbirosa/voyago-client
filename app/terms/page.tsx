import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  By accessing and using Voyago ("the Platform"), you accept and agree to be
                  bound by the terms and provision of this agreement. If you do not agree to
                  these Terms of Service, please do not use our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Description of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Voyago is a platform that connects travelers with local guides for tours and
                  experiences. We provide a marketplace where guides can list their services
                  and travelers can discover and book tours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Creation</h3>
                  <p>
                    To use certain features of our platform, you must create an account. You
                    agree to provide accurate, current, and complete information during
                    registration.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Security</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of your account
                    credentials and for all activities that occur under your account.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. User Conduct</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You agree not to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with or disrupt the platform</li>
                  <li>Collect user information without consent</li>
                  <li>Use the platform for any illegal purpose</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Guide Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Guides agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide accurate information about their tours</li>
                  <li>Honor confirmed bookings</li>
                  <li>Maintain appropriate insurance coverage</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Treat all travelers with respect and professionalism</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Traveler Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Travelers agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide accurate booking information</li>
                  <li>Arrive on time for scheduled tours</li>
                  <li>Respect the guide and other participants</li>
                  <li>Follow all safety instructions</li>
                  <li>Pay for services as agreed</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Payments and Refunds</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  All payments are processed through our secure payment system. Refund
                  policies are outlined in our booking terms. Voyago reserves the right to
                  charge service fees for transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Cancellation policies vary by tour and guide. Please review the specific
                  cancellation terms before booking. Voyago may charge cancellation fees as
                  outlined in our policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  All content on the platform, including text, graphics, logos, and software,
                  is the property of Voyago or its content suppliers and is protected by
                  copyright and other intellectual property laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Voyago acts as a marketplace and is not responsible for the conduct of users,
                  guides, or travelers. We do not guarantee the quality, safety, or legality
                  of tours listed on our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Any disputes arising from the use of our platform will be resolved through
                  binding arbitration in accordance with the rules of the American Arbitration
                  Association.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>12. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of
                  the platform after changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>13. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about these Terms of Service, please contact us
                  at:
                </p>
                <p className="mt-2">
                  Email: legal@voyago.com<br />
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

