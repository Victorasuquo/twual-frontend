import { FormEvent, useEffect, useRef, useState } from 'react'

type Opportunity = {
  title: string; source: string; category: string; location: string; value: string
  deadline: string; effort: string; fit: number; url: string; badge: 'Official' | 'Source checked'
}

const opportunities: Opportunity[] = [
  { title: 'Chevening Scholarships Nigeria', source: 'UK Government', category: 'Study', location: 'United Kingdom', value: 'Fully funded master’s', deadline: '2026-10-06T11:00:00Z', effort: 'Deep dive', fit: 96, url: 'https://www.chevening.org/scholarship/nigeria/', badge: 'Official' },
  { title: 'Young Africa Innovates · Cohort 2', source: 'UNDP + Mastercard Foundation', category: 'Capital', location: 'Akwa Ibom + 6 states', value: 'Bootcamp, grants & incubation', deadline: '2026-09-30T23:59:00+01:00', effort: 'Quick start', fit: 94, url: 'https://www.youngafricainnovates.ng/', badge: 'Official' },
  { title: 'BuildX NACOS 2026', source: 'NACOS National', category: 'Competition', location: 'Virtual · Nigeria', value: '₦1,000,000 prize pool', deadline: '2026-09-20T23:59:00+01:00', effort: 'Quick start', fit: 91, url: 'https://hack.nacos.org.ng/BuildXNACOS', badge: 'Official' },
  { title: 'Dolcezza Africa Accelerator', source: 'Dolcezza Africa', category: 'Learning', location: 'Remote · Africa', value: '97% scholarship + internship', deadline: '2026-09-20T23:59:00+01:00', effort: 'Steady build', fit: 88, url: 'https://acceleration.dolcezza.africa/', badge: 'Official' },
  { title: 'IFRA-Nigeria Research Grants 2027', source: 'IFRA-Nigeria', category: 'Fellowship', location: 'West Africa', value: 'Research funding', deadline: '2026-10-30T23:59:00+01:00', effort: 'Deep dive', fit: 87, url: 'https://www.ifra-nigeria.org/opportunities/calls-grants', badge: 'Official' },
  { title: 'Mastercard Foundation Scholars Programme', source: 'Mastercard Foundation', category: 'Study', location: 'Africa-wide', value: 'Funded education', deadline: '2026-09-15T23:59:00+01:00', effort: 'Deep dive', fit: 85, url: 'https://opportunity.africanofilter.org/', badge: 'Source checked' },
  { title: 'African Leadership University Scholarship', source: 'African Leadership University', category: 'Study', location: 'Kigali / Mauritius', value: 'Scholarship support', deadline: '2026-09-20T23:59:00+01:00', effort: 'Steady build', fit: 82, url: 'https://opportunity.africanofilter.org/', badge: 'Source checked' },
  { title: 'Westerwelle Young Founders Programme', source: 'Westerwelle Foundation', category: 'Capital', location: 'Germany + remote', value: 'Founder support', deadline: '2026-09-30T23:59:00+01:00', effort: 'Deep dive', fit: 79, url: 'https://opportunity.africanofilter.org/', badge: 'Source checked' },
]

const categories = ['Study', 'Fellowships', 'Work', 'Capital', 'Competitions', 'Learning', 'Platform']
const faqs = [
  ['Is Twual free?', 'Yes. Twual starts with a permanent free tier. Scholarships and funded education are always free, never delayed, and never hidden behind a paywall.'],
  ['How do you verify opportunities?', 'We prioritise official programme pages, check application links, watch deadlines, and remove any Source that asks people to pay to apply.'],
  ['How does Twual make money?', 'Pro pays for speed, unlimited scroll, alerts, and application tools. It never pays for access to the opportunity itself.'],
  ['Is my CV safe?', 'Your CV is used to improve your Line. Sources never receive bulk access to Runner CVs. Full privacy controls will be available in the product.'],
  ['Do you work outside Nigeria?', 'Nigeria is our first market, starting with Uyo and the South-South. The Line will expand across Africa as local supply becomes dense enough.'],
]

function daysLeft(date: string) {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
  return days > 0 ? `${days}d left` : 'Closing today'
}

function Mark({ small = false }: { small?: boolean }) { return <span className={small ? 'mark mark-small' : 'mark'} aria-hidden="true">t</span> }

function App() {
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [joined, setJoined] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [faq, setFaq] = useState<number | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selected || waitlistOpen) document.body.classList.add('modal-open')
    else document.body.classList.remove('modal-open')
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSelected(null); setWaitlistOpen(false) } }
    window.addEventListener('keydown', close)
    return () => { window.removeEventListener('keydown', close); document.body.classList.remove('modal-open') }
  }, [selected, waitlistOpen])

  useEffect(() => {
    const el = scroller.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id = 0
    let paused = false
    const tick = () => { if (!paused) { el.scrollLeft += 0.35; if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollLeft = 0 }; id = requestAnimationFrame(tick) }
    const pause = () => { paused = true }; const resume = () => { paused = false }
    el.addEventListener('mouseenter', pause); el.addEventListener('mouseleave', resume); el.addEventListener('focusin', pause); el.addEventListener('focusout', resume); el.addEventListener('touchstart', pause, { passive: true }); el.addEventListener('touchend', resume)
    id = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(id); el.removeEventListener('mouseenter', pause); el.removeEventListener('mouseleave', resume); el.removeEventListener('focusin', pause); el.removeEventListener('focusout', resume); el.removeEventListener('touchstart', pause); el.removeEventListener('touchend', resume) }
  }, [])

  const join = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormState('loading'); setTimeout(() => { setFormState('error') }, 650) }
  const openWaitlist = () => { setWaitlistOpen(true); setJoined(false); setFormState('idle') }

  return <main>
    <nav className="nav wrap"><a className="wordmark" href="#top" aria-label="Twual home"><Mark /> twual</a><div className="nav-links"><a href="#line">The Line</a><a href="#how">How it works</a><a href="#trust">Trust</a></div><button className="button button-dark button-small" onClick={openWaitlist}>Join the waitlist <span>↗</span></button></nav>

    <section id="top" className="hero wrap">
      <div className="hero-copy"><p className="kicker">THE PERSONALISED OPPORTUNITY FEED FOR AFRICA</p><h1>You already qualify for something. <em>You just have not seen it yet.</em></h1><p className="hero-sub">Twual reads your story and builds a feed of scholarships, jobs, fellowships, grants and internships you can actually win.</p><button className="button button-accent" onClick={openWaitlist}>See what you qualify for <span>↗</span></button></div>
      <div className="hero-art"><img src="/twual-hero.png" alt="A student on a tropical Nigerian campus, surrounded by notes and opportunity markers." /><div className="art-label">STARTING IN UYO<br /><strong>BUILT FOR THE NEXT MOVE</strong></div><div className="art-stamp">01<br /><span>YOUR LINE</span></div></div>
      <p className="trust-line"><span className="dot" /> Verified opportunities only. No listing on Twual will ever ask you for money.</p>
    </section>

    <section id="line" className="line-section"><div className="wrap section-head"><div><p className="kicker">MEET THE LINE</p><h2>Big possibilities.<br /><em>One scroll away.</em></h2></div><p className="section-note">A glimpse of what a qualified feed feels like. These are live opportunities, not placeholders.</p></div><div className="opportunity-scroller" ref={scroller}>{opportunities.map((op, index) => <article className={`op-card op-${index % 4}`} key={op.title} tabIndex={0}><div className="op-top"><span className="op-category">{op.category}</span><span className="fit">{op.fit} FIT</span></div><div className="op-graphic"><span>{String(index + 1).padStart(2, '0')}</span><b>{op.category === 'Study' ? 'S' : op.category === 'Capital' ? 'C' : op.category === 'Competition' ? 'X' : 'F'}</b></div><div className="op-body"><p className="source">{op.source} <span className="verified">✓</span></p><h3>{op.title}</h3><p className="op-value">{op.value}</p><div className="op-meta"><span>{op.location}</span><span className="deadline">{daysLeft(op.deadline)}</span></div><p className="effort">{op.effort} application</p><button className="apply-link" onClick={() => setSelected(op)}>Apply <span>↗</span></button></div></article>)}</div><div className="wrap line-foot"><span>Scroll to explore <span className="scroll-arrow">→</span></span><span>8 opportunities selected for launch</span></div></section>

    <section id="how" className="how wrap"><div className="how-intro"><p className="kicker">NO MORE NOISE</p><h2>The right opportunity<br /><em>changes the whole route.</em></h2><p>Twual takes the hunt out of opportunity hunting. You bring the ambition. We bring the relevance.</p></div><div className="steps"><div className="step"><span>01</span><h3>Tell us about you.</h3><p>Your interests, skills, location and where you want to go next.</p></div><div className="step"><span>02</span><h3>Get your Line.</h3><p>A living feed of things you are genuinely qualified to pursue.</p></div><div className="step"><span>03</span><h3>Lock it. Land it.</h3><p>Keep deadlines close in your Locker and track every application.</p></div></div></section>

    <section className="landings"><div className="wrap landing-inner"><div><p className="kicker">LANDINGS</p><h2>Real wins belong<br /><em>right here.</em></h2><p className="muted">A wall of confirmed wins is coming with the first Runner cohort. No borrowed stories. No made-up numbers.</p></div><div className="landing-empty"><div className="landing-cross">+</div><p>YOUR LANDING COULD BE HERE</p><span>Uyo · Akwa Ibom · Nigeria</span><button className="text-link" onClick={openWaitlist}>Be one of the first Runners ↗</button></div></div></section>

    <section className="categories wrap"><div className="category-title"><p className="kicker">THE OPPORTUNITY ECONOMY</p><h2>Not a job board.<br /><em>A wider horizon.</em></h2></div><div className="category-list">{categories.map((category, i) => <div className="category-row" key={category}><span>0{i + 1}</span><strong>{category}</strong><span className="category-arrow">↗</span></div>)}</div></section>

    <section id="trust" className="trust wrap"><div className="trust-pledge"><p className="kicker">THE HARD PROMISE</p><h2>No payment<br /><em>to apply. Ever.</em></h2><p>In a market full of advance-fee scams, trust is not a footer link. It is the product.</p><a className="text-link" href="#faq">Read the pledge ↗</a></div><div className="trust-details"><div className="trust-card"><span className="trust-number">01</span><h3>Verified Source</h3><p>We know who is behind the listing and where the application goes.</p></div><div className="trust-card"><span className="trust-number">02</span><h3>Deadline watched</h3><p>Closing dates and broken links are checked so your time is not wasted.</p></div><div className="trust-card"><span className="trust-number">03</span><h3>Runner protected</h3><p>Report a payment request in one tap. Confirmed offenders are removed.</p></div></div></section>

    <section className="pricing wrap"><div><p className="kicker">SIMPLE BY DESIGN</p><h2>Free to find.<br /><em>Worth paying for.</em></h2><p className="muted">Pay for speed, alerts and tools. Never for the opportunity itself.</p></div><div className="price-grid"><div className="price-card"><span>TWUAL FREE</span><strong>₦0</strong><p>Permanent access to your Line, including every scholarship and funded education opportunity.</p><button className="button button-outline" onClick={openWaitlist}>Join the waitlist ↗</button></div><div className="price-card featured"><span>TWUAL PRO · COMING SOON</span><strong>₦999<small>/month</small></strong><p>Unlimited scroll, early access, deeper Fit Scores, deadline reminders and a bigger Locker.</p><button className="button button-dark" onClick={openWaitlist}>Get notified first ↗</button></div></div></section>

    <section className="open-section"><div className="wrap open-inner"><div><p className="kicker">TWUAL OPEN</p><h2>Opportunity should<br /><em>stay open.</em></h2></div><div className="open-copy"><p>10% of subscription revenue will fund Pro seats for students, NYSC members and Runners who cannot pay.</p><div className="open-counter"><strong>Opening seats soon</strong><span>We will publish the number when the first seats are funded.</span></div></div></div></section>

    <section className="source-cta wrap"><div><p className="kicker">FOR SOURCES</p><h2>Have an opportunity<br /><em>worth finding?</em></h2></div><div><p>Reach qualified people, not a crowd. Twual helps organisations put the right opportunity in the right Line.</p><a className="button button-dark" href="mailto:sources@twual.com">Post as a Source <span>↗</span></a></div></section>

    <section id="faq" className="faq wrap"><div><p className="kicker">FAQ</p><h2>Good questions<br /><em>deserve straight answers.</em></h2></div><div className="faq-list">{faqs.map(([q, a], i) => <div className="faq-item" key={q}><button aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}><span>{q}</span><span>{faq === i ? '−' : '+'}</span></button>{faq === i && <p>{a}</p>}</div>)}</div></section>

    <footer className="footer"><div className="wrap footer-top"><a className="wordmark" href="#top"><Mark /> twual</a><p>Stop scrolling. Start landing.</p><button className="button button-accent" onClick={openWaitlist}>See what you qualify for ↗</button></div><div className="wrap footer-bottom"><span>© 2026 Twual. Built from Uyo, for everywhere.</span><span>Privacy · Trust · Contact</span></div></footer>

    {selected && <div className="overlay" role="presentation" onMouseDown={() => setSelected(null)}><div className="modal apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-title" onMouseDown={e => e.stopPropagation()}><button className="close" aria-label="Close" onClick={() => setSelected(null)}>×</button><p className="kicker">YOU FOUND A MATCH</p><h2 id="apply-title">{selected.title}</h2><p>This one closes in <strong>{daysLeft(selected.deadline)}</strong>. Create your free account to check if you qualify and continue to apply.</p><form onSubmit={join}><label>Name<input required name="name" autoComplete="name" /></label><label>Email or phone<input required name="contact" /></label><label>Password<input required minLength={8} type="password" name="password" /></label><button className="button button-dark" type="submit" disabled={formState === 'loading'}>{formState === 'loading' ? 'Saving your place…' : 'Create free account ↗'}</button>{formState === 'error' && <p className="form-error">The live account service is not connected yet. Join the waitlist instead and we’ll let you know when Twual opens.</p>}</form><button className="modal-secondary" onClick={openWaitlist}>Join the launch waitlist</button></div></div>}
    {waitlistOpen && <div className="overlay" role="presentation" onMouseDown={() => setWaitlistOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="waitlist-title" onMouseDown={e => e.stopPropagation()}>{joined ? <div className="success"><div className="success-mark">✓</div><p className="kicker">YOU’RE ON THE LIST</p><h2>We’ll keep a seat warm.</h2><p>We’ll send the first Line when Twual opens in your area.</p><button className="button button-dark" onClick={() => setWaitlistOpen(false)}>Back to Twual ↗</button></div> : <><button className="close" aria-label="Close" onClick={() => setWaitlistOpen(false)}>×</button><p className="kicker">THE FIRST LINE STARTS HERE</p><h2 id="waitlist-title">Put your name<br /><em>in the first scroll.</em></h2><p>Join the launch list for early access, Uyo Open Days and the first qualified opportunities in your Line.</p><form onSubmit={e => { e.preventDefault(); setJoined(true) }}><label>Name<input required name="name" autoComplete="name" /></label><label>Email or phone<input required name="contact" /></label><button className="button button-accent" type="submit">Join the waitlist ↗</button></form><small>No spam. No payment. Just the opportunities that fit.</small></>}</div></div>}
  </main>
}

export default App
