export default function Privacy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>

      <div className="mt-10 space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Information We Collect</h2>
          <p className="mt-2">We may collect personal information such as your name, email address, phone number, and location when you contact us or submit a form on our website.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">How We Use Your Information</h2>
          <p className="mt-2">Your information is used to respond to inquiries, process orders, improve our services, and communicate updates about our products and offers.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Data Security</h2>
          <p className="mt-2">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Contact Us</h2>
          <p className="mt-2">If you have any questions about this Privacy Policy, please contact us at info@specswear.pk or visit our store.</p>
        </section>
      </div>
    </div>
  );
}
