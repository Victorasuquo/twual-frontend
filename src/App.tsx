import { FormEvent, useEffect, useRef, useState } from 'react'

type Opportunity = {
  title: string; source: string; category: string; location: string; value: string
  deadline: string; effort: string; fit: number; url: string; badge: 'Official' | 'Source checked'; imagePosition: string
}

const opportunities: Opportunity[] = [
  { title: 'Chevening Scholarships Nigeria', source: 'UK Government', category: 'Study', location: 'United Kingdom', value: 'Fully funded master’s', deadline: '2026-10-06T11:00:00Z', effort: 'Deep dive', fit: 96, url: 'https://www.chevening.org/scholarship/nigeria/', badge: 'Official', imagePosition: '0% 50%' },
  { title: 'Young Africa Innovates · Cohort 2', source: 'UNDP + Mastercard Foundation', category: 'Capital', location: 'Akwa Ibom + 6 states', value: 'Bootcamp, grants & incubation', deadline: '2026-09-30T23:59:00+01:00', effort: 'Quick start', fit: 94, url: 'https://www.youngafricainnovates.ng/', badge: 'Official', imagePosition: '33% 50%' },
  { title: 'BuildX NACOS 2026', source: 'NACOS National', category: 'Competition', location: 'Virtual · Nigeria', value: '₦1,000,000 prize pool', deadline: '2026-09-20T23:59:00+01:00', effort: 'Quick start', fit: 91, url: 'https://hack.nacos.org.ng/BuildXNACOS', badge: 'Official', imagePosition: '66% 50%' },
  { title: 'Dolcezza Africa Accelerator', source: 'Dolcezza Africa', category: 'Learning', location: 'Remote · Africa', value: '97% scholarship + internship', deadline: '2026-09-20T23:59:00+01:00', effort: 'Steady build', fit: 88, url: 'https://acceleration.dolcezza.africa/', badge: 'Official', imagePosition: '100% 50%' },
  { title: 'IFRA-Nigeria Research Grants 2027', source: 'IFRA-Nigeria', category: 'Fellowship', location: 'West Africa', value: 'Research funding', deadline: '2026-10-30T23:59:00+01:00', effort: 'Deep dive', fit: 87, url: 'https://www.ifra-nigeria.org/opportunities/calls-grants', badge: 'Official', imagePosition: '0% 100%' },
  { title: 'Mastercard Foundation Scholars Programme', source: 'Mastercard Foundation', category: 'Study', location: 'Africa-wide', value: 'Funded education', deadline: '2026-09-15T23:59:00+01:00', effort: 'Deep dive', fit: 85, url: 'https://opportunity.africanofilter.org/', badge: 'Source checked', imagePosition: '33% 100%' },
  { title: 'African Leadership University Scholarship', source: 'African Leadership University', category: 'Study', location: 'Kigali / Mauritius', value: 'Scholarship support', deadline: '2026-09-20T23:59:00+01:00', effort: 'Steady build', fit: 82, url: 'https://opportunity.africanofilter.org/', badge: 'Source checked', imagePosition: '66% 100%' },
  { title: 'Westerwelle Young Founders Programme', source: 'Westerwelle Foundation', category: 'Capital', location: 'Germany + remote', value: 'Founder support', deadline: '2026-09-30T23:59:00+01:00', effort: 'Deep dive', fit: 79, url: 'https://opportunity.africanofilter.org/', badge: 'Source checked', imagePosition: '100% 100%' },
]

const categories = ['Study', 'Fellowships', 'Work', 'Capital', 'Competitions', 'Learning', 'Platform']
const faqs = [
  ['Is Twual free?', 'Yes. Twual starts with a permanent free tier. Scholarships and funded education are always free, never delayed, and never hidden behind a paywall.'],
  ['How do you verify opportunities?', 'We prioritise official programme pages, check application links, watch deadlines, and remove any Source that asks people to pay to apply.'],
  ['How does Twual make money?', 'Pro pays for speed, unlimited scroll, alerts, and application tools. It never pays for access to the opportunity itself.'],
  ['Is my CV safe?', 'Your CV is used to improve your Line. Sources never receive bulk access to Runner CVs. Full privacy controls will be available in the product.'],
  ['Do you work outside Nigeria?', 'Nigeria is our first market, starting with Uyo and the South-South. The Line will expand across Africa as local supply becomes dense enough.'],
]
const storyPreviews = [
  ['“I saw it on my Line on a Tuesday. I had never heard of it before that morning.”', 'Mfon E.', 'University of Uyo · Akwa Ibom', 'Mastercard Foundation Scholars Programme'],
  ['“Twual told me the effort was Quick. I applied from the bus.”', 'Chidi A.', 'Yaba · Lagos', 'Remote backend role'],
  ['“Fit Score showed me exactly which document I was missing.”', 'Halima B.', 'ABU · Zaria', 'Fully funded MSc'],
  ['“I applied to one thing instead of thirty. That one thing came through.”', 'Blessing O.', 'Akwa Ibom', 'Research grant'],
  ['“No degree, no connections. My Line still had things I qualified for.”', 'Musa D.', 'Plateau', 'Software fellowship'],
]

function daysLeft(date: string) {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
  return days > 0 ? `${days}d left` : 'Closing today'
}

function Mark({ small = false }: { small?: boolean }) { return <span className={small ? 'mark mark-small' : 'mark'} aria-hidden="true">t</span> }

type InfoPage = 'privacy' | 'trust' | 'contact'

function InfoPageView({ page }: { page: InfoPage }) {
  const content = {
    privacy: {
      kicker: 'PRIVACY, IN PLAIN ENGLISH',
      title: <>Your story is yours.<br /><em>Always.</em></>,
      intro: 'Twual is being built around relevance without surveillance. We collect only what helps us understand your opportunity goals, and we will explain why we need it.',
      sections: [['What we collect', 'When you join the waitlist, we collect your name and email or phone number so we can contact you about launch. When the product is live, profile details such as interests, skills, location and goals will help shape your Line.'], ['What we do not do', 'We do not sell Runner information, publish your profile, or give Sources bulk access to CVs. Twual will never ask you to pay to apply for an opportunity.'], ['Before launch', 'The current waitlist is a lightweight interest form and is not connected to a live account system yet. We will publish the full operational policy before account creation and CV uploads go live.']],
    },
    trust: {
      kicker: 'TRUSTCORE',
      title: <>Trust is not a badge.<br /><em>It is the system.</em></>,
      intro: 'Twual is designed to help people move through opportunity markets without advance-fee traps, stale links, or opaque recommendations.',
      sections: [['Source checks', 'We prioritise official programme pages, identify who is behind a listing, check where an application goes, and watch deadlines. A Source Checked label means our editorial team has reviewed the available source—not that Twual guarantees selection.'], ['No-payment pledge', 'No listing on Twual should ask a Runner for money to apply. If an opportunity requests an application fee, suspicious payment, or sensitive information too early, it should be reported and removed while we investigate.'], ['Evidence before scale', 'Trust Report metrics, verified Runner stories, and funded-seat counts will be published only when they come from Twual’s actual operating data. Until then, we label launch information clearly.']],
    },
    contact: {
      kicker: 'COME FIND US',
      title: <>Questions, ideas,<br /><em>good opportunities?</em></>,
      intro: 'Twual is starting in Uyo and building for the next move across Nigeria and Africa. Tell us what you want to see on the Line.',
      sections: [['For Runners', 'Want to join the early community, share feedback, or suggest an opportunity? Use the waitlist on the home page and include a note for the team.'], ['For Sources', 'If your organisation runs a legitimate scholarship, fellowship, job, grant, competition, or learning programme, contact us before submitting anything. We want the original source and eligibility details.'], ['Email', 'For general questions and partnerships, write to hello@twual.com. For opportunity submissions, write to sources@twual.com.']],
    },
  }[page]

  return <main className="info-page"><nav className="nav wrap"><a className="wordmark" href="/" aria-label="Twual home"><Mark /> twual</a><a className="text-link" href="/">Back to Twual ↗</a></nav><section className="info-hero wrap"><p className="kicker">{content.kicker}</p><h1>{content.title}</h1><p className="info-intro">{content.intro}</p></section><section className="info-content wrap">{content.sections.map(([heading, copy], index) => <article className="info-block" key={heading}><span>0{index + 1}</span><div><h2>{heading}</h2><p>{copy}</p></div></article>)}</section><section className="info-cta wrap"><div><p className="kicker">THE NEXT MOVE</p><h2>Find your place<br /><em>on the Line.</em></h2></div><a className="button button-accent" href="/?waitlist=1">Join the waitlist ↗</a></section><footer className="footer"><div className="wrap footer-top"><a className="wordmark" href="/"><Mark /> twual</a><p>Built from Uyo, for everywhere.</p></div><div className="wrap footer-bottom"><span>© 2026 Twual</span><span><a href="/privacy">Privacy</a> · <a href="/trust">Trust</a> · <a href="/contact">Contact</a></span></div></footer></main>
}

const partnerSteps = [
  ['01', 'Tell us what you are opening', 'Share the opportunity, who it is for, what it offers, and the official application route.'],
  ['02', 'Trustcore reviews it', 'We check the Source, eligibility, deadline, destination link, and any payment request before it reaches a Line.'],
  ['03', 'The right people see it', 'Twual puts a clear, relevant opportunity in the feeds of Runners who can genuinely pursue it.'],
]

function PartnerPageView({ onboarding = false }: { onboarding?: boolean }) {
  const [submitted, setSubmitted] = useState(false)
  const submitPartner = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true) }
  if (onboarding) return <main className="partner-page onboarding-page"><nav className="nav wrap"><a className="wordmark" href="/" aria-label="Twual home"><Mark /> twual</a><a className="text-link" href="/partners">Partner overview ↗</a></nav><section className="onboarding-hero wrap"><p className="kicker">SOURCE ONBOARDING</p><h1>Put a real opportunity<br /><em>in the right Line.</em></h1><p>Start a submission for Trustcore review. This form is a frontend preview and does not publish to Twual yet.</p></section>{submitted ? <section className="partner-success wrap"><span className="success-mark">✓</span><p className="kicker">DRAFT RECEIVED</p><h2>We have your opportunity.<br /><em>Next comes review.</em></h2><p>Our team will verify the Source and application route before anything is published. No opportunity is live from this preview.</p><a className="button button-dark" href="/partners">Back to Partners ↗</a></section> : <form className="partner-form wrap" onSubmit={submitPartner}><div className="form-intro"><p className="kicker">OPPORTUNITY DETAILS</p><h2>Give Runners<br /><em>a clear route.</em></h2><p>One complete submission is easier to verify and easier for the right person to act on.</p></div><div className="form-fields"><label>Organisation name<input required name="organisation" placeholder="Your organisation" /></label><label>Work email<input required type="email" name="email" placeholder="name@organisation.org" /></label><label>Opportunity title<input required name="title" placeholder="e.g. Graduate fellowship" /></label><label>Official application URL<input required type="url" name="url" placeholder="https://" /></label><label>Category<select required name="category" defaultValue=""><option value="" disabled>Select a category</option><option>Study</option><option>Fellowship</option><option>Work</option><option>Capital</option><option>Competition</option><option>Learning</option></select></label><label>Application deadline<input required type="date" name="deadline" /></label><label className="field-wide">Who is this for?<textarea required name="eligibility" rows={4} placeholder="Tell us about eligibility, location, and the person you want to reach." /></label><label className="field-wide">What does it offer?<textarea required name="value" rows={4} placeholder="Funding, stipend, internship, prize, training, or other value." /></label><label className="check-row field-wide"><input required type="checkbox" name="truth" /> <span>I confirm this is an official opportunity and the details are accurate.</span></label><button className="button button-accent field-wide" type="submit">Send for Trustcore review ↗</button><p className="form-note field-wide">Preview only. Your submission is not sent to a live backend.</p></div></form>}<footer className="footer"><div className="wrap footer-top"><a className="wordmark" href="/"><Mark /> twual</a><p>For Sources who open doors.</p></div><div className="wrap footer-bottom"><span>© 2026 Twual</span><span><a href="/privacy">Privacy</a> · <a href="/trust">Trust</a> · <a href="/contact">Contact</a></span></div></footer></main>

  return <main className="partner-page"><nav className="nav wrap"><a className="wordmark" href="/" aria-label="Twual home"><Mark /> twual</a><div className="nav-links"><a href="#why-partner">Why Twual</a><a href="#trustcore">Trustcore</a><a href="#process">Process</a><a href="/partners/dashboard">Dashboard</a></div><a className="button button-dark button-small" href="/partners/onboard">Post an opportunity ↗</a></nav><section className="partner-hero wrap"><div><p className="kicker">FOR SOURCES AND ORGANISATIONS</p><h1>Open the right door.<br /><em>Reach the right person.</em></h1><p>Twual helps legitimate organisations place scholarships, fellowships, jobs, grants, competitions, and learning opportunities in front of people who can genuinely pursue them.</p><div className="partner-actions"><a className="button button-dark" href="/partners/onboard">Post an opportunity ↗</a><a className="text-link" href="#process">See how it works ↓</a></div></div><div className="partner-art"><div className="partner-art-note">SOURCE<br /><strong>TRUSTCORE REVIEW</strong></div><div className="partner-art-card"><span>THE LINE</span><strong>One clear<br />opportunity<br /><em>at a time.</em></strong><small>For people ready to move.</small></div></div></section><section id="why-partner" className="partner-proof wrap"><div><p className="kicker">THE SOURCE PROMISE</p><h2>Visibility is useful.<br /><em>Relevance is better.</em></h2></div><div className="proof-copy"><p>Twual is not a billboard. We do the work of helping a Source meet the person its opportunity was made for.</p><div className="proof-list"><span>01</span><p>Clear eligibility, not vague reach</p><span>02</span><p>Official links, not lead capture</p><span>03</span><p>Qualified Runners, not empty impressions</p></div></div></section><section id="trustcore" className="partner-trust"><div className="wrap"><p className="kicker">TRUSTCORE</p><h2>Every opportunity<br /><em>earns its place.</em></h2><div className="trustcore-grid">{['Source identity','Application route','Deadline and eligibility'].map((item, i) => <div className="trustcore-item" key={item}><span>0{i + 1}</span><h3>{item}</h3><p>{['We confirm who is behind the opportunity before it is listed.','We check that Runners are sent to the intended official destination.','We keep the details clear so people can decide with confidence.'][i]}</p></div>)}</div></div></section><section id="process" className="partner-process wrap"><div><p className="kicker">FROM SUBMISSION TO LINE</p><h2>A calmer way<br /><em>to be found.</em></h2><a className="button button-accent" href="/partners/onboard">Start a submission ↗</a></div><div className="partner-steps">{partnerSteps.map(([number, title, copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section><section className="partner-final"><div className="wrap"><p className="kicker">READY WHEN YOU ARE</p><h2>Give a good opportunity<br /><em>a better route.</em></h2><a className="button button-dark" href="/partners/onboard">Post as a Source ↗</a></div></section><footer className="footer"><div className="wrap footer-top"><a className="wordmark" href="/"><Mark /> twual</a><p>For Sources who open doors.</p></div><div className="wrap footer-bottom"><span>© 2026 Twual</span><span><a href="/privacy">Privacy</a> · <a href="/trust">Trust</a> · <a href="/contact">Contact</a></span></div></footer></main>
}

function PartnerDashboard() {
  const [filter, setFilter] = useState('All posts')
  const filters = ['All posts', 'Drafts', 'In review', 'Published']
  return <main className="source-dashboard"><aside className="dashboard-sidebar"><a className="wordmark" href="/" aria-label="Twual home"><Mark /> twual</a><div className="source-identity"><span className="source-avatar">U</span><div><strong>Your organisation</strong><small>Source workspace</small></div></div><nav className="dashboard-nav" aria-label="Source workspace"><a className="active" href="/partners/dashboard">Overview</a><a href="#posts">Your posts</a><a href="/partners/onboard">New opportunity <span>+</span></a><a href="#trust-status">Trustcore status</a></nav><a className="dashboard-back" href="/partners">← Partners</a></aside><section className="dashboard-main"><header className="dashboard-topbar"><div><p className="kicker">SOURCE WORKSPACE · PREVIEW</p><h1>Good morning.<br /><em>Let’s open a door.</em></h1></div><a className="button button-dark" href="/partners/onboard">Post an opportunity ↗</a></header><div className="dashboard-notice"><span>PREVIEW MODE</span><p>This workspace is ready for your organisation, but it is not connected to a live account or analytics service yet.</p></div><section className="dashboard-metrics" aria-label="Source overview"><div><span>LIVE POSTS</span><strong>0</strong><small>Ready to publish</small></div><div><span>IN REVIEW</span><strong>0</strong><small>Trustcore queue</small></div><div><span>RUNNER MOVES</span><strong>—</strong><small>Available after launch</small></div><div><span>TRUSTCORE</span><strong>Listed</strong><small>Complete onboarding to verify</small></div></section><section id="posts" className="dashboard-posts"><div className="dashboard-section-head"><div><p className="kicker">YOUR OPPORTUNITIES</p><h2>Posts with a<br /><em>clear next step.</em></h2></div><div className="filter-tabs" role="tablist" aria-label="Filter opportunities">{filters.map(item => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item}</button>)}</div></div><div className="dashboard-empty"><div className="empty-index">01</div><div><h3>{filter === 'All posts' ? 'No opportunities yet.' : `No ${filter.toLowerCase()} yet.`}</h3><p>Your first opportunity will appear here after you save it as a draft or send it to Trustcore review.</p><a className="button button-accent" href="/partners/onboard">Create your first post ↗</a></div></div></section><section id="trust-status" className="dashboard-trust"><div><p className="kicker">TRUSTCORE STATUS</p><h2>Earn trust<br /><em>before reach.</em></h2><p>Complete these steps so Runners know the Source behind an opportunity is real.</p></div><div className="dashboard-checklist"><div><span>01</span><strong>Work email</strong><small>Pending setup</small></div><div><span>02</span><strong>Organisation registration</strong><small>Pending setup</small></div><div><span>03</span><strong>Personal association</strong><small>Pending setup</small></div><div><span>04</span><strong>Human review</strong><small>Starts after submission</small></div></div></section><section className="dashboard-insight"><p className="kicker">WHEN YOU GO LIVE</p><h2>See who notices.<br /><em>Learn what moves.</em></h2><p>Published Sources will eventually see views, clicks, interests, and Moves. Twual will show the shape of the people reached, not expose private Runner data.</p><span>Analytics unlock after a verified post.</span></section><footer className="dashboard-footer"><span>© 2026 Twual</span><span><a href="/privacy">Privacy</a> · <a href="/trust">Trust</a> · <a href="/contact">Contact</a></span></footer></section></main>
}

function App() {
  const page = window.location.pathname.replace(/^\//, '') as InfoPage
  if (page === 'privacy' || page === 'trust' || page === 'contact') return <InfoPageView page={page} />
  if (page === 'partners') return <PartnerPageView />
  if (page === 'partners/onboard') return <PartnerPageView onboarding />
  if (page === 'partners/dashboard') return <PartnerDashboard />
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [waitlistOpen, setWaitlistOpen] = useState(() => new URLSearchParams(window.location.search).get('waitlist') === '1')
  const [joined, setJoined] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [faq, setFaq] = useState<number | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const parallaxImage = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const image = parallaxImage.current
        const section = image?.parentElement
        if (!image || !section) return
        const distance = window.innerHeight / 2 - section.getBoundingClientRect().top
        image.style.transform = `translate3d(0, ${Math.max(-42, Math.min(42, distance / 18))}px, 0)`
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => { window.removeEventListener('scroll', update); cancelAnimationFrame(raf) }
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

    <section id="line" className="line-section"><div className="wrap section-head"><div><p className="kicker">MEET THE LINE</p><h2>Big possibilities.<br /><em>One scroll away.</em></h2></div><p className="section-note">A glimpse of what a qualified feed feels like. These are live opportunities, not placeholders.</p></div><div className="opportunity-scroller" ref={scroller}>{opportunities.map((op, index) => <article className="op-card" key={op.title} tabIndex={0}><div className="op-top"><span className="op-category">{op.category}</span><span className="fit">{op.fit} FIT</span></div><div className="op-graphic" style={{ backgroundImage: `url(/twual-line.png)`, backgroundPosition: op.imagePosition }}><span>{String(index + 1).padStart(2, '0')}</span><b>{op.category === 'Study' ? 'S' : op.category === 'Capital' ? 'C' : op.category === 'Competition' ? 'X' : 'F'}</b></div><div className="op-body"><p className="source">{op.source} <span className="verified">✓</span></p><h3>{op.title}</h3><p className="op-value">{op.value}</p><div className="op-meta"><span>{op.location}</span><span className="deadline">{daysLeft(op.deadline)}</span></div><p className="effort">{op.effort} application</p><button className="apply-link" onClick={() => setSelected(op)}>Apply <span>↗</span></button></div></article>)}</div><div className="wrap line-foot"><span>Scroll to explore <span className="scroll-arrow">→</span></span><span>8 opportunities selected for launch</span></div></section>

    <section id="how" className="how wrap"><div className="how-intro"><p className="kicker">NO MORE NOISE</p><h2>The right opportunity<br /><em>changes the whole route.</em></h2><p>Twual takes the hunt out of opportunity hunting. You bring the ambition. We bring the relevance.</p><button className="button button-dark" onClick={openWaitlist}>Build my Line ↗</button></div><div className="steps"><div className="step"><span>01</span><h3>Tell us about you.</h3><p>Your interests, skills, location and where you want to go next.</p></div><div className="step"><span>02</span><h3>Get your Line.</h3><p>A living feed of things you are genuinely qualified to pursue.</p></div><div className="step"><span>03</span><h3>Lock it. Land it.</h3><p>Keep deadlines close in your Locker and track every application.</p></div></div></section>

    <section className="landings"><div className="wrap landing-head"><div><p className="kicker">LANDINGS</p><h2>Real wins belong<br /><em>right here.</em></h2></div><p className="muted">The strongest proof will come from Runners like you. These are story-format previews until the first consented Landings are ready to publish.</p></div><div className="review-track">{storyPreviews.map(([quote, name, place, landing], i) => <article className="review-card" key={name}><span className="review-label">STORY PREVIEW · 0{i + 1}</span><blockquote>{quote}</blockquote><div className="review-person"><span className="avatar">{name[0]}</span><div><strong>{name}</strong><span>{place}</span></div></div><p className="review-landing">Landed · {landing}</p></article>)}</div><div className="wrap landing-cta"><button className="text-link" onClick={openWaitlist}>Be one of the first Runners ↗</button><span>Real names and proof replace these previews before launch.</span></div></section>

    <section className="categories wrap"><div className="category-title"><p className="kicker">THE OPPORTUNITY ECONOMY</p><h2>Not a job board.<br /><em>A wider horizon.</em></h2><button className="button button-outline" onClick={() => document.getElementById("line")?.scrollIntoView({ behavior: "smooth" })}>Explore the Line ↗</button></div><div className="category-list">{categories.map((category, i) => <div className="category-row" key={category}><span>0{i + 1}</span><strong>{category}</strong><span className="category-arrow">↗</span></div>)}</div></section>

    <section id="trust" className="trust wrap"><div className="trust-pledge"><p className="kicker">THE HARD PROMISE</p><h2>No payment<br /><em>to apply. Ever.</em></h2><p>In a market full of advance-fee scams, trust is not a footer link. It is the product.</p><a className="text-link" href="#faq">Read the pledge ↗</a><br /><button className="button button-outline trust-cta" onClick={openWaitlist}>Join a trusted Line ↗</button></div><div className="trust-details"><div className="trust-card"><span className="trust-number">01</span><h3>Verified Source</h3><p>We know who is behind the listing and where the application goes.</p></div><div className="trust-card"><span className="trust-number">02</span><h3>Deadline watched</h3><p>Closing dates and broken links are checked so your time is not wasted.</p></div><div className="trust-card"><span className="trust-number">03</span><h3>Runner protected</h3><p>Report a payment request in one tap. Confirmed offenders are removed.</p></div></div></section>

    <section className="pricing wrap"><div><p className="kicker">SIMPLE BY DESIGN</p><h2>Free to find.<br /><em>Worth paying for.</em></h2><p className="muted">Pay for speed, alerts and tools. Never for the opportunity itself.</p></div><div className="price-grid"><div className="price-card"><span>TWUAL FREE</span><strong>₦0</strong><p>Permanent access to your Line, including every scholarship and funded education opportunity.</p><button className="button button-outline" onClick={openWaitlist}>Join the waitlist ↗</button></div><div className="price-card featured"><span>TWUAL PRO · COMING SOON</span><strong>₦999<small>/month</small></strong><p>Unlimited scroll, early access, deeper Fit Scores, deadline reminders and a bigger Locker.</p><button className="button button-dark" onClick={openWaitlist}>Get notified first ↗</button></div></div></section>

    <section className="open-section"><div className="wrap open-inner"><div><p className="kicker">TWUAL OPEN</p><h2>Opportunity should<br /><em>stay open.</em></h2></div><div className="open-copy"><p>10% of subscription revenue will fund Pro seats for students, NYSC members and Runners who cannot pay.</p><div className="open-counter"><strong>Opening seats soon</strong><span>We will publish the number when the first seats are funded.</span></div></div><button className="button button-accent" onClick={openWaitlist}>Support Twual Open ↗</button></div></section>

    <section className="source-cta wrap"><div><p className="kicker">FOR SOURCES</p><h2>Have an opportunity<br /><em>worth finding?</em></h2></div><div><p>Reach qualified people, not a crowd. Twual helps organisations put the right opportunity in the right Line.</p><a className="button button-dark" href="mailto:sources@twual.com">Post as a Source <span>↗</span></a></div></section>

    <section className="footer-parallax"><div className="footer-parallax-image" ref={parallaxImage} /><div className="wrap footer-parallax-copy"><p className="kicker">THE NEXT MOVE</p><h2>Find the thing<br /><em>that finds you.</em></h2><button className="button button-accent" onClick={openWaitlist}>See what you qualify for ↗</button></div></section>

    <section id="faq" className="faq wrap"><div><p className="kicker">FAQ</p><h2>Good questions<br /><em>deserve straight answers.</em></h2><a className="text-link" href="mailto:hello@twual.com">Ask Twual a question ↗</a></div><div className="faq-list">{faqs.map(([q, a], i) => <div className="faq-item" key={q}><button aria-expanded={faq === i} onClick={() => setFaq(faq === i ? null : i)}><span>{q}</span><span>{faq === i ? '−' : '+'}</span></button>{faq === i && <p>{a}</p>}</div>)}</div></section>

    <footer className="footer"><div className="wrap footer-top"><a className="wordmark" href="#top"><Mark /> twual</a><p>Stop scrolling. Start landing.</p><button className="button button-accent" onClick={openWaitlist}>See what you qualify for ↗</button></div><div className="wrap footer-bottom"><span>© 2026 Twual. Built from Uyo, for everywhere.</span><span><a href="/privacy">Privacy</a> · <a href="/trust">Trust</a> · <a href="/contact">Contact</a></span></div></footer>

    {selected && <div className="overlay" role="presentation" onMouseDown={() => setSelected(null)}><div className="modal apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-title" onMouseDown={e => e.stopPropagation()}><button className="close" aria-label="Close" onClick={() => setSelected(null)}>×</button><p className="kicker">YOU FOUND A MATCH</p><h2 id="apply-title">{selected.title}</h2><p>This one closes in <strong>{daysLeft(selected.deadline)}</strong>. Create your free account to check if you qualify and continue to apply.</p><form onSubmit={join}><label>Name<input required name="name" autoComplete="name" /></label><label>Email or phone<input required name="contact" /></label><label>Password<input required minLength={8} type="password" name="password" /></label><button className="button button-dark" type="submit" disabled={formState === 'loading'}>{formState === 'loading' ? 'Saving your place…' : 'Create free account ↗'}</button>{formState === 'error' && <p className="form-error">The live account service is not connected yet. Join the waitlist instead and we’ll let you know when Twual opens.</p>}</form><button className="modal-secondary" onClick={openWaitlist}>Join the launch waitlist</button></div></div>}
    {waitlistOpen && <div className="overlay" role="presentation" onMouseDown={() => setWaitlistOpen(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="waitlist-title" onMouseDown={e => e.stopPropagation()}>{joined ? <div className="success"><div className="success-mark">✓</div><p className="kicker">YOU’RE ON THE LIST</p><h2>We’ll keep a seat warm.</h2><p>We’ll send the first Line when Twual opens in your area.</p><button className="button button-dark" onClick={() => setWaitlistOpen(false)}>Back to Twual ↗</button></div> : <><button className="close" aria-label="Close" onClick={() => setWaitlistOpen(false)}>×</button><p className="kicker">THE FIRST LINE STARTS HERE</p><h2 id="waitlist-title">Put your name<br /><em>in the first scroll.</em></h2><p>Join the launch list for early access, Uyo Open Days and the first qualified opportunities in your Line.</p><form onSubmit={e => { e.preventDefault(); setJoined(true) }}><label>Name<input required name="name" autoComplete="name" /></label><label>Email or phone<input required name="contact" /></label><button className="button button-accent" type="submit">Join the waitlist ↗</button></form><small>No spam. No payment. Just the opportunities that fit.</small></>}</div></div>}
  </main>
}

export default App
