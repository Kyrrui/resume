import { profile } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="07 /"
          title="Let's build something"
          caption="I'm especially interested in agentic infra, novel cryptographic UX, and anything where the on-chain and AI sides actually need each other."
        />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Inline contact form placeholder — wired to an email service later. */}
          <ContactFormPlaceholder />

          {/* LinkedIn card */}
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                LinkedIn
              </div>
              <span className="text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-white">
                ↗
              </span>
            </div>
            <div className="mt-6">
              <div className="font-mono text-base text-[var(--text)]">
                in/kyle-c-bryant
              </div>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Quickest way to reach me until the form is live.
              </p>
            </div>
          </a>
        </div>

        <footer className="mt-20 flex flex-col gap-3 border-t border-white/[0.05] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-faint)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span>
              Block <span className="text-[var(--text-muted)]">#latest</span> ·
              built with Next.js, Tailwind, and motion
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--text-faint)]">
            © {new Date().getFullYear()} {profile.name}
          </div>
        </footer>
      </div>
    </section>
  );
}

// Visual scaffold of the eventual send-from-the-site form.
// Wire the action/fetch to the email service when it's set up.
function ContactFormPlaceholder() {
  return (
    <form
      aria-label="Contact form (not yet active)"
      className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 md:p-7"
    >
      <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-200">
        <span className="inline-block h-1 w-1 rounded-full bg-amber-300" />
        Coming soon
      </div>

      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
        Send a message
      </div>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Drop a note and I'll reply by email. Hookup pending.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="Name" placeholder="Ada Lovelace" />
        <Field label="Email" placeholder="ada@example.com" type="email" />
      </div>
      <Field
        as="textarea"
        label="Message"
        placeholder="What are you building?"
        rows={5}
        className="mt-3"
      />

      <button
        type="submit"
        disabled
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm text-[var(--text-muted)] cursor-not-allowed sm:w-auto"
      >
        <span className="font-mono text-[var(--text-faint)]">$</span>
        <span>send</span>
        <span className="text-[var(--text-faint)]">— disabled</span>
      </button>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  rows,
  as,
  className = "",
}: {
  label: string;
  placeholder: string;
  type?: string;
  rows?: number;
  as?: "textarea";
  className?: string;
}) {
  const fieldClass =
    "w-full bg-transparent border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-violet-400/40 disabled:cursor-not-allowed";
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
        {label}
      </span>
      <div className="mt-1.5">
        {as === "textarea" ? (
          <textarea
            placeholder={placeholder}
            rows={rows}
            disabled
            className={fieldClass}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            disabled
            className={fieldClass}
          />
        )}
      </div>
    </label>
  );
}
