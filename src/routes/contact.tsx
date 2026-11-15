import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Instagram, Linkedin, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { IconArrowOut } from "@/components/icons";
import { PageHero, Shell, delay, useReveal } from "@/components/site/Shell";
import { contactRoutes, enquiryTags } from "@/lib/siteData";
import heroImg from "@/assets/gallery-imeche-award.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Team AeRoVe" },
      { name: "description", content: "Sponsorship, collaboration, campus visits, press and recruitment: reach Team AeRoVe at IIT Bombay." },
      { property: "og:title", content: "Contact — Team AeRoVe" },
    ],
  }),
  component: Contact,
});

const EMAIL = "teamaerove@gmail.com";

function Contact() {
  useReveal();
  const [topic, setTopic] = useState(enquiryTags[0]!);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // No backend on GitHub Pages: the form drafts an email in the visitor's own mail app.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `[${topic}] ${name}${org ? ` · ${org}` : ""}`;
    const body = `${message}\n\n— ${name}${org ? `\n${org}` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* clipboard blocked */ }
  };

  return (
    <Shell current="contact">
      <PageHero index="06" kicker="Contact us" title={<>Let&rsquo;s build<br />what flies next.</>} image={heroImg}
        lede="Sponsors, research groups, companies and students — every aircraft we fly starts with a conversation. Reach the team directly and we reply within a couple of days." />

      <section className="band contact-band">
        <form className="enquiry reveal" onSubmit={submit}>
          <p className="kicker"><span>01</span>Send an enquiry</p>
          <fieldset>
            <legend>What's it about?</legend>
            <div className="filter-row">
              {enquiryTags.map((t) => <button key={t} type="button" className={`chip ${topic === t ? "is-on" : ""}`} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>)}
            </div>
          </fieldset>
          <div className="field-row">
            <label className="field"><span>Your name</span><input required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label className="field"><span>Organisation <em>(optional)</em></span><input value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" /></label>
          </div>
          <label className="field"><span>Message</span><textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
          <div className="enquiry-actions">
            <button type="submit" className="btn btn-primary"><Send />Draft email</button>
            <small>Opens your mail app with the message filled in.</small>
          </div>
        </form>

        <aside className="contact-side">
          <p className="kicker reveal"><span>02</span>Or reach us directly</p>
          {contactRoutes.map(({ label, value, href: to, icon: Icon }, i) => (
            <a className="contact-card reveal" style={delay(i * 70)} key={label} href={to} target={to.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <span className="contact-icon"><Icon /></span>
              <span><small>{label}</small><strong>{value}</strong></span>
              <IconArrowOut className="contact-card-arrow" />
            </a>
          ))}
          <button type="button" className="copy-email reveal" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? "Copied" : `Copy ${EMAIL}`}</button>
          <div className="contact-socials reveal">
            <a href="https://www.instagram.com/aerove_iitb/" target="_blank" rel="noreferrer" aria-label="Team AeRoVe on Instagram"><Instagram /></a>
            <a href="https://in.linkedin.com/company/unmesh-mashruwala-innovation-cell-iit-bombay" target="_blank" rel="noreferrer" aria-label="UMIC on LinkedIn"><Linkedin /></a>
          </div>
          <div className="map-card reveal">
            <iframe title="Map: Desai Sethi School of Entrepreneurship, IIT Bombay" loading="lazy" referrerPolicy="no-referrer"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.9083%2C19.1294%2C72.9183%2C19.1374&amp;layer=mapnik&amp;marker=19.1334%2C72.9133" />
          </div>
        </aside>
      </section>
    </Shell>
  );
}
