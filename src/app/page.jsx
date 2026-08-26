"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, Check, Users, Wallet, TrendingUp, ShieldCheck,
  Landmark, CalendarDays, Smartphone, Siren, UserPlus, KeyRound, Signal,
  LineChart, UserCog, UserRound, ChevronDown, Phone, Mail, MapPin, BellRing,
} from "lucide-react";
import Brand from "@/components/Brand";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LandingPage() {
  const { login, register } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("register");

  return (
    <>
      {/* ---------- header: logo far left ---------- */}
      <header className="site-header">
        <div className="container">
          <Brand />
          <nav className="site-nav">
            <span className="site-nav__links row" style={{ gap: 26 }}>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#phones">Any phone</a>
              <a href="#faq">FAQ</a>
              <a href="#contact">Contact</a>
            </span>
            <a className="btn btn--sm" href="#auth">Get started</a>
          </nav>
        </div>
      </header>

      <main className="landing">
        {/* ---------- hero + auth ---------- */}
        <section className="container hero" id="auth">
          <div className="hero__copy">
            <span className="eyebrow"><Sparkles size={14} /> AI-powered chama management</span>
            <h1>
              Karibu to <span className="accent">Pamoja&nbsp;Network</span> — where the
              village saves as one.
            </h1>
            <p className="lede">
              A transparent, trusted home for your chama. Track every contribution and loan,
              catch mistakes before they cause disputes, and let smart forecasts guide your
              group&rsquo;s next step — all reachable from a basic phone.
            </p>

            <div className="cta-row">
              <a className="btn btn--lg" href="#auth">Create your account <ArrowRight size={18} /></a>
              <a className="btn btn--lg btn--ghost" href="#how">See how it works</a>
            </div>

            <div className="trust">
              <div>
                <div className="stat__value mono">60%+</div>
                <div className="tiny">of Kenyan adults save in a chama</div>
              </div>
              <div>
                <div className="stat__value mono">0</div>
                <div className="tiny">paper ledgers to lose or dispute</div>
              </div>
              <div>
                <div className="stat__value mono">USSD</div>
                <div className="tiny">works on every phone</div>
              </div>
            </div>

            <p className="hero__integrations">
              <Signal size={14} /> Works with M-Pesa &middot; Africa&rsquo;s Talking SMS &middot; USSD short-code
            </p>
          </div>

          {/* auth panel + floating accent cards */}
          <div className="auth-wrap">
            <div className="float-card float-card--recv" aria-hidden="true">
              <span className="float-card__dot" />
              <div>
                <div className="float-card__t">Contribution received</div>
                <div className="float-card__v mono">+ KES 2,000 &middot; M-Pesa</div>
              </div>
            </div>
            <div className="float-card float-card--fore" aria-hidden="true">
              <div className="float-card__t">Group pool forecast</div>
              <div className="spark-bars">
                <span style={{ height: "40%" }} />
                <span style={{ height: "55%" }} />
                <span style={{ height: "50%" }} />
                <span style={{ height: "72%" }} />
                <span style={{ height: "86%" }} />
                <span style={{ height: "100%" }} />
              </div>
              <div className="float-card__v mono">KES 248k &middot; trending up</div>
            </div>

            <div className="auth-card" id="get-started">
              <div className="auth-tabs" role="tablist">
                <button role="tab" aria-selected={tab === "register"} onClick={() => setTab("register")}>
                  Register
                </button>
                <button role="tab" aria-selected={tab === "login"} onClick={() => setTab("login")}>
                  Log in
                </button>
              </div>
              {tab === "register" ? (
                <RegisterForm onDone={register} toast={toast} switchToLogin={() => setTab("login")} />
              ) : (
                <LoginForm onDone={login} toast={toast} />
              )}
            </div>
          </div>
        </section>

        {/* ---------- integrations trust bar ---------- */}
        <div className="trustbar">
          <div className="container trustbar__inner">
            <span className="trustbar__label">Built on the rails Kenyan groups already trust</span>
            <div className="trustbar__chips">
              <span className="chip"><Wallet size={15} /> M-Pesa STK push</span>
              <span className="chip"><BellRing size={15} /> SMS receipts</span>
              <span className="chip"><Signal size={15} /> USSD menu</span>
              <span className="chip"><ShieldCheck size={15} /> AI anomaly checks</span>
            </div>
          </div>
        </div>

        {/* ---------- how it works ---------- */}
        <section className="sec" id="how">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--center"><KeyRound size={14} /> Up and running in minutes</span>
              <h2>From first contribution to year-end share-out</h2>
              <p className="section-sub">
                No spreadsheets, no torn notebooks. Four simple steps take your whole group online.
              </p>
            </Reveal>

            <div className="steps">
              <Step no="1" icon={<UserPlus size={20} />} title="Create your account"
                text="Register as a group leader or a member with your name, phone and a password. It takes a minute." />
              <Step no="2" icon={<KeyRound size={20} />} title="Start or join a group"
                text="Leaders create a chama and share a join token. Members enter the token to request a place." />
              <Step no="3" icon={<Wallet size={20} />} title="Contribute via M-Pesa"
                text="Members pay in with an M-Pesa STK push. Every shilling is logged and receipted by SMS." />
              <Step no="4" icon={<TrendingUp size={20} />} title="Track, forecast & grow"
                text="Watch the pot grow, approve loans with a risk score, and plan ahead with AI forecasts." />
            </div>
          </div>
        </section>

        {/* ---------- features ---------- */}
        <section className="sec sec--tint" id="features">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--center"><Sparkles size={14} /> Everything in one place</span>
              <h2>A complete toolkit for your chama</h2>
              <p className="section-sub">
                Built for group leaders and members alike — transparent, fair and easy for everyone to use.
              </p>
            </Reveal>

            <div className="feature-grid">
              <Feature icon={<Users size={22} />} bg="var(--ocean)" title="Groups & members"
                text="Create a group, share a join token, and approve members with one tap." />
              <Feature icon={<Wallet size={22} />} bg="var(--green)" title="Contributions & M-Pesa"
                text="Members pay in via M-Pesa; every shilling is logged and receipted by SMS." />
              <Feature icon={<TrendingUp size={22} />} bg="var(--teal)" title="Contribution forecast"
                text="See where your group's savings are heading with AI predictions." />
              <Feature icon={<ShieldCheck size={22} />} bg="var(--navy)" title="Anomaly detection"
                text="Unusual entries are flagged early, protecting the group from errors and fraud." />
              <Feature icon={<Landmark size={22} />} bg="var(--ocean)" title="Loans made fair"
                text="Request, review and approve loans with a data-backed default risk score." />
              <Feature icon={<CalendarDays size={22} />} bg="var(--teal)" title="Announcements & calendar"
                text="Share meeting dates, venues and notices — no one is left out of the loop." />
              <Feature icon={<Smartphone size={22} />} bg="var(--green)" title="Works on basic phones"
                text="A USSD menu brings the whole system to feature phones, offline-friendly." />
              <Feature icon={<Siren size={22} />} bg="var(--navy)" title="Emergency help"
                text="Raise an emergency and instantly alert every member of the group." />
            </div>
          </div>
        </section>

        {/* ---------- USSD / any phone (signature) ---------- */}
        <section className="sec" id="phones">
          <div className="container phones__grid">
            <Reveal className="phones__copy">
              <span className="eyebrow"><Signal size={14} /> No smartphone? No problem.</span>
              <h2>Reaches every member, on any phone</h2>
              <p className="section-sub section-sub--left">
                Not everyone in the village owns a smartphone or has data. Pamoja Network runs on a
                simple USSD short-code, so every member can check the group and contribute from the
                most basic handset — and receive an SMS receipt for every payment.
              </p>
              <ul className="ticks">
                <li><Check size={17} /> Dial a short-code — no app, no data bundle</li>
                <li><Check size={17} /> Check your balance and the group pool</li>
                <li><Check size={17} /> Contribute and repay loans over M-Pesa</li>
                <li><Check size={17} /> Get the next meeting date by SMS</li>
              </ul>
            </Reveal>

            <Reveal className="phones__device" delay={120}>
              <div className="phone" aria-hidden="true">
                <span className="phone__speaker" />
                <div className="phone__screen">
                  <div className="phone__status">
                    <span>USSD</span><span className="mono">*384*7300#</span>
                  </div>
                  <div className="phone__ussd">
                    <div className="ussd-title">PAMOJA NETWORK</div>
                    <div className="ussd-line"><span className="mono">1</span> My balance</div>
                    <div className="ussd-line"><span className="mono">2</span> Contribute</div>
                    <div className="ussd-line"><span className="mono">3</span> Loans</div>
                    <div className="ussd-line"><span className="mono">4</span> Announcements</div>
                    <div className="ussd-line"><span className="mono">5</span> Next meeting</div>
                    <div className="ussd-line ussd-line--muted"><span className="mono">0</span> Exit</div>
                  </div>
                  <div className="phone__keys">
                    <span>Cancel</span>
                    <span className="phone__send">Send</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- dashboard preview ---------- */}
        <section className="sec sec--tint" id="preview">
          <div className="container preview__grid">
            <Reveal className="preview__win" delay={120}>
              <div className="win" aria-hidden="true">
                <div className="win__bar">
                  <span className="win__dots"><i /><i /><i /></span>
                  <span className="win__addr mono">pamojanetwork.co.ke/leader</span>
                </div>
                <div className="win__body">
                  <div className="win__welcome">Karibu back, <strong>Mama Atieno</strong> 👋</div>
                  <div className="mini-stats">
                    <div className="mini-stat">
                      <span className="mini-stat__l">Group pool</span>
                      <span className="mini-stat__v mono">KES 248,000</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-stat__l">Members</span>
                      <span className="mini-stat__v mono">24</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-stat__l">Active loans</span>
                      <span className="mini-stat__v mono">3</span>
                    </div>
                  </div>
                  <div className="mini-chart">
                    <div className="mini-chart__head">
                      <span>Contributions</span><span className="tiny">last 6 months</span>
                    </div>
                    <div className="mini-bars">
                      <span style={{ height: "38%" }} />
                      <span style={{ height: "52%" }} />
                      <span style={{ height: "47%" }} />
                      <span style={{ height: "68%" }} />
                      <span style={{ height: "80%" }} />
                      <span style={{ height: "96%" }} />
                    </div>
                  </div>
                  <div className="mini-row">
                    <span className="mini-row__dot mini-row__dot--ok" />
                    <span>Grace W. contributed <strong>KES 2,000</strong></span>
                    <span className="tiny mini-row__t">just now</span>
                  </div>
                  <div className="mini-row">
                    <span className="mini-row__dot mini-row__dot--warn" />
                    <span>Unusual entry flagged for review</span>
                    <span className="tiny mini-row__t">2h ago</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="preview__copy">
              <span className="eyebrow"><LineChart size={14} /> The leader dashboard</span>
              <h2>See the whole group at a glance</h2>
              <p className="section-sub section-sub--left">
                Contributions, loans, members and alerts live on one clean screen. Nothing is hidden,
                so trust is built into every view — and the AI quietly watches for anything unusual.
              </p>
              <ul className="ticks">
                <li><Check size={17} /> Real-time pool balance and member activity</li>
                <li><Check size={17} /> One-tap approvals for members and loans</li>
                <li><Check size={17} /> Flagged anomalies before they become disputes</li>
                <li><Check size={17} /> Reports and statements ready for every meeting</li>
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---------- roles ---------- */}
        <section className="sec" id="roles">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--center"><Users size={14} /> Made for both sides of the table</span>
              <h2>Whether you lead or you save</h2>
            </Reveal>
            <div className="roles">
              <Reveal className="role">
                <div className="role__head">
                  <span className="role__ic" style={{ background: "var(--navy)" }}><UserCog size={22} /></span>
                  <div>
                    <h3>For group leaders</h3>
                    <p className="tiny">Run the chama with confidence</p>
                  </div>
                </div>
                <ul className="ticks">
                  <li><Check size={17} /> Create groups and approve new members</li>
                  <li><Check size={17} /> Review loans with an AI default-risk score</li>
                  <li><Check size={17} /> Post announcements, events and emergencies</li>
                  <li><Check size={17} /> Track fines, reports and the full statement</li>
                </ul>
              </Reveal>
              <Reveal className="role" delay={120}>
                <div className="role__head">
                  <span className="role__ic" style={{ background: "var(--teal)" }}><UserRound size={22} /></span>
                  <div>
                    <h3>For members</h3>
                    <p className="tiny">Save with total peace of mind</p>
                  </div>
                </div>
                <ul className="ticks">
                  <li><Check size={17} /> Join a group with a simple token</li>
                  <li><Check size={17} /> Contribute over M-Pesa and see your history</li>
                  <li><Check size={17} /> Request loans and follow their status</li>
                  <li><Check size={17} /> Never miss a meeting or announcement</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="sec sec--tint" id="faq">
          <div className="container faq__wrap">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--center"><ChevronDown size={14} /> Good questions</span>
              <h2>Frequently asked</h2>
            </Reveal>
            <Faq
              items={[
                {
                  q: "Do all members need a smartphone?",
                  a: "No. Members with a smartphone use the web dashboard, and everyone else can use the USSD short-code on any basic phone. Payments and receipts work the same either way.",
                },
                {
                  q: "How do members pay their contributions?",
                  a: "Through M-Pesa. Pamoja sends an STK push to the member's phone; they enter their PIN, and the payment is logged automatically with an SMS receipt.",
                },
                {
                  q: "How does the loan risk score work?",
                  a: "An AI model looks at contribution history and simple financial signals to estimate the chance of default, giving leaders a low / medium / high band to guide — not replace — the group's decision.",
                },
                {
                  q: "Is our group's money safe and private?",
                  a: "Pamoja records and tracks transactions; the money itself stays in your group's own M-Pesa or bank account. Member income details are kept private and used only to tailor advice.",
                },
                {
                  q: "What does it cost to get started?",
                  a: "You can register and set up your group for free. Create your account above and share the join token with your members to begin.",
                },
              ]}
            />
          </div>
        </section>

        {/* ---------- CTA band ---------- */}
        <section className="cta-band">
          <div className="container cta-band__inner">
            <div>
              <h2>Ready to bring your chama online?</h2>
              <p>Set up your group in minutes and invite your members today — no paperwork required.</p>
            </div>
            <div className="cta-band__actions">
              <a className="btn btn--lg btn--spark" href="#auth">Get started free <ArrowRight size={18} /></a>
              <a className="btn btn--lg btn--ghost btn--ghost-light" href="#how">How it works</a>
            </div>
          </div>
        </section>

        {/* ---------- slogan band ---------- */}
        <section className="slogan">
          <div className="container">
            <h2>Tukiweka pamoja, tunakua pamoja.</h2>
            <p>When we save together, we grow together — from the village to the nation.</p>
          </div>
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Brand light />
              <p>
                A digital chama management system with AI-powered financial insights,
                built for the savings groups of rural Kenya.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how">How it works</a></li>
                <li><a href="#phones">USSD access</a></li>
                <li><a href="#auth">Register</a></li>
                <li><Link href="/member">Member access</Link></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="#roles">For leaders</a></li>
                <li><a href="#roles">For members</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#">Privacy &amp; terms</a></li>
              </ul>
            </div>
            <div>
              <h4>Contact us</h4>
              <div className="contact-line"><Phone size={15} /> +254 110272019</div>
              <div className="contact-line"><Mail size={15} /> phelixomondi788@gmail.com</div>
              <div className="contact-line"><MapPin size={15} /> Homa Bay, Kenya</div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Pamoja Network. All rights reserved.</span>
            <span>Made with pride in Kenya 🇰🇪</span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */
function Feature({ icon, title, text, bg }) {
  return (
    <div className="feature">
      <div className="ic" style={{ background: bg }}>{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Step({ no, icon, title, text }) {
  return (
    <div className="step">
      <div className="step__no">{no}</div>
      <div className="step__ic">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

/* Reveal-on-scroll wrapper (no-op / visible under reduced motion via CSS) */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal-up ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq__item ${isOpen ? "open" : ""}`} key={i}>
            <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{it.q}</span>
              <ChevronDown size={19} className="faq__chev" />
            </button>
            <div className="faq__a"><p>{it.a}</p></div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */
function RegisterForm({ onDone, toast, switchToLogin }) {
  const [f, setF] = useState({
    name: "", email: "", contact: "", monthlyIncome: "",
    password: "", confirm: "", role: "MEMBER", terms: false,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (f.password !== f.confirm) return setErr("Passwords do not match.");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    if (!f.terms) return setErr("Please accept the terms and conditions to continue.");
    setBusy(true);
    try {
      await onDone({
        name: f.name.trim(),
        email: f.email.trim(),
        contact: f.contact.trim(),
        monthlyIncome: Number(f.monthlyIncome || 0),
        password: f.password,
        role: f.role,
      });
      toast.ok(`Karibu, ${f.name.split(" ")[0]}! Your account is ready.`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="stack" style={{ "--s": "14px" }}>
      <div>
        <h2>Create your account</h2>
        <p className="sub">Join your chama or start a brand-new one.</p>
      </div>
      {err && <div className="form-error">{err}</div>}

      <div className="field">
        <label>Full name</label>
        <input className="input" value={f.name} onChange={set("name")} placeholder="e.g. Mama Atieno" required />
      </div>
      <div className="field-2">
        <div className="field">
          <label>Email</label>
          <input className="input" type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" required />
        </div>
        <div className="field">
          <label>Phone contact</label>
          <input className="input" value={f.contact} onChange={set("contact")} placeholder="+2547…" required />
        </div>
      </div>
      <div className="field">
        <label>Monthly income (KES)</label>
        <input className="input mono" type="number" min="0" value={f.monthlyIncome} onChange={set("monthlyIncome")} placeholder="e.g. 15000" required />
        <div className="field__hint">Helps tailor contribution and loan advice. Kept private.</div>
      </div>
      <div className="field-2">
        <div className="field">
          <label>Password</label>
          <input className="input" type="password" value={f.password} onChange={set("password")} placeholder="••••••••" required />
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input className="input" type="password" value={f.confirm} onChange={set("confirm")} placeholder="••••••••" required />
        </div>
      </div>

      <div className="field">
        <label>I am joining as</label>
        <div className="segment" role="group" aria-label="Choose role">
          <button type="button" aria-pressed={f.role === "MEMBER"} onClick={() => setF({ ...f, role: "MEMBER" })}>
            Member
          </button>
          <button type="button" aria-pressed={f.role === "LEADER"} onClick={() => setF({ ...f, role: "LEADER" })}>
            Group leader / Admin
          </button>
        </div>
      </div>

      <label className="check">
        <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} />
        <span>I agree to the <a href="#" style={{ color: "var(--ocean)", fontWeight: 600 }}>Terms &amp; Conditions</a> and Privacy Policy of Pamoja Network.</span>
      </label>

      <button className="btn btn--lg btn--block" disabled={busy}>
        {busy ? "Creating account…" : "Register"}
      </button>
      <p className="tiny center">
        Already have an account?{" "}
        <button type="button" onClick={switchToLogin} style={{ color: "var(--ocean)", fontWeight: 700 }}>Log in</button>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */
function LoginForm({ onDone, toast }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const u = await onDone(name.trim(), password);
      toast.ok(`Welcome back, ${u.name.split(" ")[0]}!`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="stack" style={{ "--s": "16px" }}>
      <div>
        <h2>Welcome back</h2>
        <p className="sub">Log in to your Pamoja Network dashboard.</p>
      </div>
      {err && <div className="form-error">{err}</div>}
      <div className="field">
        <label>Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your registered name" required />
      </div>
      <div className="field">
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      </div>
      <button className="btn btn--lg btn--block" disabled={busy}>
        {busy ? "Logging in…" : "Log in"}
      </button>
      <p className="tiny center">Leaders reach the leader dashboard; members enter their group token next.</p>
    </form>
  );
}
