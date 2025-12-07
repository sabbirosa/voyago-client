import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Cookies are small text files that are placed on your device when you visit a
                  website. They are widely used to make websites work more efficiently and to
                  provide information to the website owners.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We use cookies for the following purposes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the platform to function
                    properly, including authentication and security features.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how visitors interact
                    with our platform by collecting and reporting information anonymously.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings
                    to provide a personalized experience.
                  </li>
                  <li>
                    <strong>Advertising Cookies:</strong> Used to deliver relevant advertisements
                    and track campaign effectiveness.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Session Cookies</h3>
                  <p>
                    These cookies are temporary and are deleted when you close your browser.
                    They are essential for the platform to function during your visit.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                  <p>
                    These cookies remain on your device for a set period or until you delete
                    them. They help us remember your preferences and improve your experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Third-Party Cookies</h3>
                  <p>
                    These cookies are set by third-party services that appear on our pages,
                    such as analytics providers and advertising networks.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  You can control and manage cookies in various ways. Please keep in mind that
                  removing or blocking cookies may impact your user experience and parts of our
                  platform may no longer be fully accessible.
                </p>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Browser Settings</h3>
                  <p>
                    Most browsers allow you to refuse or accept cookies. You can also set your
                    browser to notify you when cookies are being sent. Instructions for
                    managing cookies in popular browsers:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>
                      <a
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Safari
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We may use third-party services that set cookies on your device. These
                  services help us analyze usage, provide advertising, and improve our
                  platform. We do not control these third-party cookies, and you should
                  review their privacy policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  We may update this Cookie Policy from time to time. We will notify you of
                  any changes by posting the new policy on this page and updating the "Last
                  updated" date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  If you have any questions about our use of cookies, please contact us at:
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

