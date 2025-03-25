import { Layout } from "@/components/layout"

export default function TermsPage() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Terms and Conditions</h1>
            <p className="text-muted-foreground mt-2">Last updated: June 2023</p>
          </div>
          
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                Welcome to VocalWell. These Terms and Conditions govern your use of our website and services. 
                By accessing or using VocalWell, you agree to be bound by these Terms. If you disagree with any part of the terms, 
                you may not access the service.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">2. Use of Service</h2>
              <p>
                VocalWell provides an AI-powered voice analysis tool designed to help detect potential voice disorders. 
                Our service is intended for informational purposes only and should not be considered a substitute for professional medical advice, 
                diagnosis, or treatment.
              </p>
              <p>
                You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, 
                restrict or inhibit anyone else's use and enjoyment of the service.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">3. Account Registration</h2>
              <p>
                To use certain features of our service, you may be required to register for an account. 
                You agree to provide accurate, current, and complete information during the registration process and to update such information 
                to keep it accurate, current, and complete.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. 
                We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">4. Privacy Policy</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, protect, and disclose information and data when you use our services. 
                By using VocalWell, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">5. Data Usage</h2>
              <p>
                When you upload voice recordings to our service, you grant us a license to use, process, and analyze this data for the purpose of providing our voice analysis services. 
                We may also use anonymized data to improve our algorithms and services.
              </p>
              <p>
                We take data security seriously and implement appropriate measures to protect your information. However, no method of transmission over the Internet 
                or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
              <p>
                In no event shall VocalWell, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, 
                consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your access to or use of or inability to access or use the service.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">7. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' 
                notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <p>
                By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms. 
                If you do not agree to the new terms, please stop using the service.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">8. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@vocalwell.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
} 