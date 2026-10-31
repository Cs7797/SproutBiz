import { apiFetch } from "../lib/api";
import { Link } from "react-router-dom";
import HomeBg from "../assets/homebg.jpg";
import HometopBg from "../assets/hometopimg.png";
import Hometop2Bg from "../assets/top2.png";
import CampaignCard from "../components/CampaignCard";
import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import "./home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const revealRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiFetch("/api/champaign/getAllChampaigns");
        const responseData = await res.json();
        if (!res.ok) {
          setErrorMessage(responseData?.message || "Failed to load campaigns.");
          setData([]);
          return;
        }
        setData(Array.isArray(responseData) ? responseData : []);
      } catch {
        setErrorMessage("Unable to load campaigns. Please try again.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (!revealRef.current || !window.IntersectionObserver) return undefined;
    revealRef.current.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 }
    );
    revealRef.current.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      revealRef.current?.classList.remove("reveal-ready");
    };
  }, [loading, data.length]);

  if (loading) return <Loader />;

  const ctaTo = currentUser ? "/profile" : "/signin";
  const campaigns = data;

  return (
    <main className="home-page" ref={revealRef}>
      <section className="hero-shell">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${HomeBg})` }} />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-kicker"><span className="kicker-dot" /> A smarter way to grow together</div>
            <h1>Big ideas grow<br /><span>better together.</span></h1>
            <p>Discover promising ventures, invest in focused batches, and be part of the progress from day one.</p>
            <div className="hero-actions">
              <Link to={ctaTo} className="hero-button">Explore opportunities <span aria-hidden="true">↗</span></Link>
              <a href="#how-it-works" className="hero-link">How it works <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><span>S</span><span>B</span><span>+</span></div><span>Built for founders and forward thinkers</span></div>
          </div>
          <div className="hero-visual" aria-label="Entrepreneurship and investment illustration">
            <div className="visual-glow" />
            <img className="hero-illustration hero-illustration-back" src={Hometop2Bg} alt="" />
            <img className="hero-illustration hero-illustration-front" src={HometopBg} alt="" />
            <div className="floating-note note-growth"><span className="note-icon">↗</span><span><strong>Ideas in motion</strong><small>One batch at a time</small></span></div>
            <div className="floating-note note-community"><span className="community-mark">✳</span><span><strong>Grow together</strong><small>Make your next move</small></span></div>
          </div>
        </div>
        <a className="hero-scroll" href="#opportunities"><span /> Scroll to explore</a>
      </section>

      <section className="value-strip" aria-label="SproutBiz benefits">
        <div className="value-item"><span className="value-icon">◈</span><span><strong>Invest in batches</strong><small>Approach each opportunity your way</small></span></div>
        <div className="value-divider" />
        <div className="value-item"><span className="value-icon">⌁</span><span><strong>Back real founders</strong><small>Discover ideas with room to grow</small></span></div>
        <div className="value-divider" />
        <div className="value-item"><span className="value-icon">✳</span><span><strong>Move at your pace</strong><small>Explore opportunities on your terms</small></span></div>
      </section>

      <section className="opportunities-section" id="opportunities">
        <div className="section-heading" data-reveal>
          <div><span className="section-eyebrow">THE OPPORTUNITY BOARD</span><h2>Ideas worth<br className="mobile-break" /> growing into.</h2></div>
          <p>Get to know the founders and the ideas shaping what comes next.</p>
        </div>
        {errorMessage && <p className="home-message home-error">{errorMessage}</p>}
        {campaigns.length > 0 ? (
          <div className="campaign-grid">
            {campaigns.map((item, index) => <div key={item._id} className="campaign-reveal" data-reveal style={{ "--reveal-delay": `${index * 90}ms` }}><CampaignCard item={item} /></div>)}
          </div>
        ) : !errorMessage ? (
          <div className="empty-opportunities" data-reveal><span className="empty-spark">✳</span><h3>Something good is growing.</h3><p>New opportunities are on the way. Check back soon to explore what’s next.</p></div>
        ) : null}
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-intro" data-reveal><span className="section-eyebrow">A CLEARER WAY FORWARD</span><h2>Good things grow<br /><span>one step at a time.</span></h2><p>Big goals feel more approachable when the journey is broken into thoughtful steps.</p><Link to={ctaTo} className="how-link">Start exploring <span>↗</span></Link></div>
        <div className="steps-list">
          <article className="step-card" data-reveal><span className="step-number">01</span><div><h3>Find your idea</h3><p>Explore ventures and meet the people bringing them to life.</p></div><span className="step-arrow">↗</span></article>
          <article className="step-card" data-reveal><span className="step-number">02</span><div><h3>Choose your batch</h3><p>See how each opportunity is structured and find your fit.</p></div><span className="step-arrow">↗</span></article>
          <article className="step-card" data-reveal><span className="step-number">03</span><div><h3>Grow together</h3><p>Follow the journey as founders turn ambition into progress.</p></div><span className="step-arrow">↗</span></article>
        </div>
      </section>

      <section className="closing-cta" data-reveal>
        <div className="cta-decoration cta-decoration-one" /><div className="cta-decoration cta-decoration-two" />
        <span className="section-eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>Let’s make room<br />for what’s next.</h2>
        <p>Meet a new generation of ideas and the people bold enough to build them.</p>
        <Link to={ctaTo} className="cta-button">Find your next opportunity <span>↗</span></Link>
      </section>
    </main>
  );
};

export default Home;
