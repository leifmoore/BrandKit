import React, { useState, useEffect, useRef } from "react";
import { Copy, Check, Menu, X, ArrowUpRight, Download, ChevronRight } from "lucide-react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
const tokens = {
  colors: {
    primary: [
      { name: "Deep Navy", alias: "navy-900", hex: "#14284b", rgb: "20 / 40 / 75", cmyk: "73 / 47 / 0 / 71" },
      { name: "Off-White", alias: "cream-50", hex: "#fefefd", rgb: "254 / 254 / 253", cmyk: "0 / 0 / 0 / 0" },
    ],
    navy: [
      { name: "Midnight", alias: "navy-1000", hex: "#0a1530", rgb: "10 / 21 / 48", cmyk: "79 / 56 / 0 / 81" },
      { name: "Deep Navy", alias: "navy-900", hex: "#14284b", rgb: "20 / 40 / 75", cmyk: "73 / 47 / 0 / 71" },
      { name: "Dusk", alias: "navy-700", hex: "#26467d", rgb: "38 / 70 / 125", cmyk: "70 / 44 / 0 / 51" },
      { name: "Cam Blue", alias: "navy-500", hex: "#3d68b0", rgb: "61 / 104 / 176", cmyk: "65 / 41 / 0 / 31" },
      { name: "Sky", alias: "navy-300", hex: "#7e9bd5", rgb: "126 / 155 / 213", cmyk: "41 / 27 / 0 / 16" },
      { name: "Mist", alias: "navy-100", hex: "#c2d0ec", rgb: "194 / 208 / 236", cmyk: "18 / 12 / 0 / 7" },
      { name: "Vapour", alias: "navy-50", hex: "#e7edf8", rgb: "231 / 237 / 248", cmyk: "7 / 4 / 0 / 3" },
    ],
    cream: [
      { name: "Off-White", alias: "cream-50", hex: "#fefefd", rgb: "254 / 254 / 253", cmyk: "0 / 0 / 0 / 0" },
      { name: "Vellum", alias: "cream-75", hex: "#fcfaf3", rgb: "252 / 250 / 243", cmyk: "0 / 1 / 4 / 1" },
      { name: "Cream", alias: "cream-100", hex: "#f8f3e3", rgb: "248 / 243 / 227", cmyk: "0 / 2 / 8 / 3" },
      { name: "Ivory", alias: "cream-200", hex: "#f0e8cf", rgb: "240 / 232 / 207", cmyk: "0 / 3 / 14 / 6" },
      { name: "Parchment", alias: "cream-300", hex: "#e6d9b3", rgb: "230 / 217 / 179", cmyk: "0 / 6 / 22 / 10" },
      { name: "Stone", alias: "cream-400", hex: "#d4c8a6", rgb: "212 / 200 / 166", cmyk: "0 / 6 / 22 / 17" },
    ],
    gold: [
      { name: "Honey", alias: "gold-300", hex: "#e3c277", rgb: "227 / 194 / 119", cmyk: "0 / 15 / 48 / 11" },
      { name: "Lantern Gold", alias: "gold-500", hex: "#c9a24a", rgb: "201 / 162 / 74", cmyk: "0 / 19 / 63 / 21" },
      { name: "Brass", alias: "gold-700", hex: "#9c7a2f", rgb: "156 / 122 / 47", cmyk: "0 / 22 / 70 / 39" },
    ],
  },
};

// ─── SHARED STYLES ─────────────────────────────────────────────────────────
const fontStack = {
  display: `"Gill Sans", "Gill Sans MT", "Gill Sans Nova", Calibri, "Trebuchet MS", sans-serif`,
  body: `"Inter", -apple-system, "Segoe UI", system-ui, sans-serif`,
  mono: `ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`,
};

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function BrandPortal() {
  const [section, setSection] = useState("overview");
  const [navOpen, setNavOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  const sections = [
    { id: "overview", label: "Overview", num: "00" },
    { id: "brand", label: "About the brand", num: "01" },
    { id: "logo", label: "Logo", num: "02" },
    { id: "colour", label: "Colour", num: "03" },
    { id: "typography", label: "Typography", num: "04" },
    { id: "voice", label: "Voice", num: "05" },
    { id: "photography", label: "Photography", num: "06" },
    { id: "graphics", label: "Graphics & icons", num: "07" },
    { id: "charts", label: "Charts", num: "08" },
    { id: "applications", label: "Applications", num: "09" },
  ];

  return (
    <div
      style={{
        fontFamily: fontStack.body,
        background: "#fefefd",
        color: "#14284b",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        html, body, #root { margin: 0; padding: 0; }
        ::selection { background: #c9a24a; color: #14284b; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fadeUp { animation: fadeUp 0.5s cubic-bezier(0.2, 0.6, 0.2, 1) both; }
        .hairline { background: rgba(20, 40, 75, 0.12); height: 1px; border: 0; margin: 0; }
        .swatch-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .swatch-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(20, 40, 75, 0.08); }
        .nav-btn { transition: color 0.15s ease; }
        .nav-btn:hover { color: #c9a24a !important; }
        .copy-btn { transition: all 0.15s ease; }
        .copy-btn:hover { background: rgba(20, 40, 75, 0.06); }
        @media (max-width: 880px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 881px) {
          .sidebar-mobile-toggle, .sidebar-mobile-overlay { display: none !important; }
        }
      `}</style>

      {/* Mobile menu toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setNavOpen(!navOpen)}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          display: "none",
          width: 44,
          height: 44,
          borderRadius: 22,
          border: "1px solid rgba(20,40,75,0.15)",
          background: "#fefefd",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {navOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {navOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setNavOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,40,75,0.4)",
            zIndex: 90,
          }}
        />
      )}

      <Sidebar
        sections={sections}
        section={section}
        setSection={(s) => { setSection(s); setNavOpen(false); }}
        navOpen={navOpen}
      />

      <main
        ref={mainRef}
        style={{
          flex: 1,
          minWidth: 0,
          maxHeight: "100vh",
          overflowY: "auto",
          background: "#fefefd",
        }}
      >
        <div key={section} className="fadeUp" style={{ padding: "clamp(2rem, 5vw, 4.5rem)", maxWidth: 1100, margin: "0 auto" }}>
          {section === "overview" && <Overview setSection={setSection} />}
          {section === "brand" && <BrandSection />}
          {section === "logo" && <LogoSection />}
          {section === "colour" && <ColourSection />}
          {section === "typography" && <TypographySection />}
          {section === "voice" && <VoiceSection />}
          {section === "photography" && <PhotographySection />}
          {section === "graphics" && <GraphicsSection />}
          {section === "charts" && <ChartsSection />}
          {section === "applications" && <ApplicationsSection />}
          <Footer />
        </div>
      </main>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────
function Sidebar({ sections, section, setSection, navOpen }) {
  return (
    <aside
      className="sidebar-desktop"
      style={{
        width: 280,
        flexShrink: 0,
        background: "#14284b",
        color: "#fefefd",
        padding: "2.5rem 1.75rem",
        display: navOpen ? "flex" : "flex",
        flexDirection: "column",
        position: navOpen ? "fixed" : "sticky",
        top: 0,
        left: 0,
        zIndex: 95,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            fontFamily: fontStack.display,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          SCUDAMORE'S
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#c2d0ec",
            marginTop: 6,
            fontWeight: 500,
          }}
        >
          Brand Portal · est. 1910
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className="nav-btn"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              padding: "10px 12px",
              border: "none",
              background: section === s.id ? "rgba(254,254,253,0.08)" : "transparent",
              color: section === s.id ? "#fefefd" : "rgba(254,254,253,0.7)",
              fontSize: 14,
              fontFamily: fontStack.body,
              fontWeight: section === s.id ? 500 : 400,
              textAlign: "left",
              cursor: "pointer",
              borderRadius: 4,
              borderLeft: section === s.id ? "2px solid #c9a24a" : "2px solid transparent",
              transition: "all 0.18s ease",
            }}
          >
            <span style={{ fontFamily: fontStack.mono, fontSize: 11, color: "#c9a24a", opacity: 0.8 }}>{s.num}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </nav>

      <div
        style={{
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(254,254,253,0.1)",
          fontSize: 11,
          color: "rgba(254,254,253,0.5)",
          lineHeight: 1.5,
        }}
      >
        v0.1 · Working draft
        <br />
        Last updated 8 May 2026
      </div>
    </aside>
  );
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────────
function PageHeader({ num, eyebrow, title, lede }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: fontStack.mono,
            fontSize: 13,
            color: "#9c7a2f",
            letterSpacing: "0.1em",
          }}
        >
          {num}
        </div>
        <div style={{ flex: 1, height: 1, background: "rgba(20,40,75,0.12)" }} />
        <div
          style={{
            fontSize: 11,
            color: "#9c7a2f",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </div>
      </div>
      <h1
        style={{
          fontFamily: fontStack.display,
          fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          margin: "0 0 1.25rem",
          color: "#14284b",
        }}
      >
        {title}
      </h1>
      {lede && (
        <p
          style={{
            fontSize: "1.125rem",
            lineHeight: 1.6,
            color: "#26467d",
            maxWidth: 640,
            margin: 0,
            fontWeight: 400,
          }}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

function H2({ children }) {
  return (
    <h2
      style={{
        fontFamily: fontStack.display,
        fontSize: "1.75rem",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        margin: "3rem 0 1rem",
        color: "#14284b",
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }) {
  return (
    <h3
      style={{
        fontSize: "1.0625rem",
        fontWeight: 600,
        lineHeight: 1.4,
        margin: "1.75rem 0 0.5rem",
        color: "#14284b",
        letterSpacing: "-0.005em",
      }}
    >
      {children}
    </h3>
  );
}

function P({ children, muted }) {
  return (
    <p
      style={{
        fontSize: 15,
        lineHeight: 1.7,
        color: muted ? "#4e5d78" : "#14284b",
        margin: "0 0 1rem",
        maxWidth: 680,
      }}
    >
      {children}
    </p>
  );
}

function Callout({ children, variant = "neutral" }) {
  const variants = {
    neutral: { bg: "#f8f3e3", border: "#c9a24a", color: "#14284b" },
    warning: { bg: "#fef3e3", border: "#9c7a2f", color: "#14284b" },
    info: { bg: "#e7edf8", border: "#3d68b0", color: "#14284b" },
  };
  const v = variants[variant];
  return (
    <div
      style={{
        background: v.bg,
        borderLeft: `2px solid ${v.border}`,
        padding: "1rem 1.25rem",
        margin: "1.5rem 0",
        fontSize: 14.5,
        lineHeight: 1.6,
        color: v.color,
        maxWidth: 680,
      }}
    >
      {children}
    </div>
  );
}

// ─── SECTION: OVERVIEW ────────────────────────────────────────────────────
function Overview({ setSection }) {
  return (
    <>
      <div
        style={{
          fontSize: 11,
          color: "#9c7a2f",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        Brand Portal · v0.1
      </div>
      <h1
        style={{
          fontFamily: fontStack.display,
          fontSize: "clamp(3rem, 7vw, 5.5rem)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.025em",
          margin: "0 0 1.5rem",
          color: "#14284b",
        }}
      >
        Where Cambridge<br />goes punting.
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          lineHeight: 1.55,
          color: "#26467d",
          maxWidth: 580,
          margin: "0 0 3rem",
        }}
      >
        The working brand guidelines for Scudamore's Punting Company — Cambridge's oldest punting company, punting gently down the Cam since 1910.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: "3rem",
        }}
      >
        {[
          { num: "01", title: "About the brand", id: "brand", note: "Mission, vision, values, audiences" },
          { num: "02", title: "Logo", id: "logo", note: "Variations, clear space, sizing" },
          { num: "03", title: "Colour", id: "colour", note: "Palette, accessibility, mood cues" },
          { num: "04", title: "Typography", id: "typography", note: "Gill Sans + Inter, hierarchy, house style" },
          { num: "05", title: "Voice", id: "voice", note: "Five traits, sniff test, channel tone" },
          { num: "06", title: "Photography", id: "photography", note: "Subjects, consent, formats" },
          { num: "07", title: "Graphics & icons", id: "graphics", note: "Libraries, decorative use" },
          { num: "08", title: "Charts", id: "charts", note: "Data viz rules, chart types" },
          { num: "09", title: "Applications", id: "applications", note: "Real product structure, status" },
        ].map((card) => (
          <button
            key={card.id}
            onClick={() => setSection(card.id)}
            style={{
              textAlign: "left",
              border: "1px solid rgba(20,40,75,0.12)",
              background: "#fefefd",
              padding: "1.5rem",
              cursor: "pointer",
              fontFamily: fontStack.body,
              transition: "all 0.18s ease",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minHeight: 140,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#c9a24a";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(20,40,75,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(20,40,75,0.12)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: fontStack.mono, fontSize: 12, color: "#9c7a2f" }}>{card.num}</span>
              <ArrowUpRight size={16} style={{ color: "#9c7a2f" }} />
            </div>
            <div style={{ fontFamily: fontStack.display, fontSize: 22, fontWeight: 700, color: "#14284b", marginTop: "auto" }}>
              {card.title}
            </div>
            <div style={{ fontSize: 13, color: "#4e5d78", lineHeight: 1.5 }}>{card.note}</div>
          </button>
        ))}
      </div>

      <Callout>
        <strong>This is a working draft.</strong> Sections marked with 🟡 are placeholders awaiting team input. The follow-ups list at the bottom of each relevant section captures what's outstanding. Designed to live and grow with the brand.
      </Callout>
    </>
  );
}

// ─── SECTION: ABOUT THE BRAND ─────────────────────────────────────────────
function BrandSection() {
  return (
    <>
      <PageHeader
        num="01"
        eyebrow="About the brand"
        title="A century on the Cam."
        lede="Scudamore's is Cambridge's oldest punting company — punting gently down the Cam since 1910. The voice and visual system flow from this single fact."
      />

      <H2>Positioning</H2>
      <P>A quintessentially Cambridge experience on the river, built on over a century of craft and care for the Cam.</P>

      <H2>Brand goal</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, margin: "1rem 0 2rem" }}>
        <div style={{ background: "#14284b", color: "#fefefd", padding: "2rem 1.75rem" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e3c277", marginBottom: 12 }}>
            For locals
          </div>
          <div style={{ fontFamily: fontStack.display, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
            Where Cambridge<br />goes punting.
          </div>
        </div>
        <div style={{ background: "#f8f3e3", color: "#14284b", padding: "2rem 1.75rem" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9c7a2f", marginBottom: 12 }}>
            For visitors
          </div>
          <div style={{ fontFamily: fontStack.display, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
            Where Britain<br />goes punting.
          </div>
        </div>
      </div>

      <H2>Mission</H2>
      <P>To create timeless Cambridge memories.</P>

      <H2>Vision</H2>
      <ThreePillars
        items={[
          { name: "Accessibility", desc: "To make the pleasure of being on the water accessible to everybody, regardless of age, experience or ability." },
          { name: "Community", desc: "To be the place where Cambridge comes to enjoy the river — for exercise, learning, or relaxation." },
          { name: "Hospitality", desc: "To act as ambassadors for Cambridge, giving guests the best experience possible of our city." },
        ]}
      />

      <H2>Values</H2>
      <ValueRow
        title="Heritage"
        sub="Founders and custodians"
        body="We are both the founders and custodians of punting in Cambridge, respecting the river and celebrating its rich heritage."
      />
      <ValueRow
        title="Experience"
        sub="Welcoming hosts"
        body="We act as courteous and attentive hosts, making customers feel they are being introduced to the city by an informed friend."
      />
      <ValueRow
        title="Development"
        sub="Nurturing our people"
        body="We create the best environment for our people to develop their knowledge, skills and confidence in the pursuit of excellence."
      />
      <ValueRow
        title="Pioneering"
        sub="Responsible · Expert · Innovative"
        body="Our story is intertwined with Cambridge's. We feel a strong sense of responsibility to our community and environment, deep expertise in the city and its history, and a constant drive to innovate — from ergonomic boat seating to bat safari wildlife tours."
      />

      <H2>Audiences</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "1rem 0" }}>
        {[
          "Tourists & visitors to Cambridge",
          "Locals & Cambridge residents",
          "Students & alumni",
          "Corporate & private hire clients",
          "Wedding & special occasion bookings",
          "B2B partnerships",
        ].map((a) => (
          <div key={a} style={{ padding: "1rem 1.25rem", background: "#fcfaf3", borderLeft: "2px solid #c9a24a", fontSize: 14, fontWeight: 500 }}>
            {a}
          </div>
        ))}
      </div>
    </>
  );
}

function ThreePillars({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "1rem 0 2rem" }}>
      {items.map((it) => (
        <div key={it.name} style={{ padding: "1.5rem", background: "#fcfaf3", borderTop: "2px solid #c9a24a" }}>
          <div style={{ fontFamily: fontStack.display, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{it.name}</div>
          <div style={{ fontSize: 14, lineHeight: 1.55, color: "#26467d" }}>{it.desc}</div>
        </div>
      ))}
    </div>
  );
}

function ValueRow({ title, sub, body }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(140px, 200px) 1fr", gap: 32, padding: "1.5rem 0", borderTop: "1px solid rgba(20,40,75,0.12)" }}>
      <div>
        <div style={{ fontFamily: fontStack.display, fontSize: 22, fontWeight: 700, color: "#14284b" }}>{title}</div>
        <div style={{ fontSize: 12, fontStyle: "italic", color: "#9c7a2f", marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.65, color: "#26467d" }}>{body}</div>
    </div>
  );
}

// ─── SECTION: LOGO ────────────────────────────────────────────────────────
function LogoSection() {
  return (
    <>
      <PageHeader
        num="02"
        eyebrow="Logo"
        title="The mark."
        lede="Two primary variations cover almost every use case. Use whichever gives the strongest contrast against its background — legibility comes first."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: "2.5rem" }}>
        <LogoCard bg="#fefefd" border solid />
        <LogoCard bg="#14284b" outline />
      </div>

      <H2>Clear space</H2>
      <P>Clear space flexes between <strong>0.25× and 0.5×</strong> of the logo height depending on context. When in doubt, give it more room — the logo should never feel crowded.</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, margin: "1rem 0 2rem" }}>
        <ClearSpaceDemo level="0.5×" label="Preferred — standalone use, hero moments" />
        <ClearSpaceDemo level="0.25×" label="Acceptable — tight layouts, headers" />
      </div>

      <H2>Minimum size</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, margin: "1rem 0" }}>
        <MinSizeCard medium="Print" min="25mm" note="Below this, fine details break" />
        <MinSizeCard medium="Digital" min="90px" note="Below this, type loses clarity" />
      </div>

      <H2>Don'ts</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "1rem 0" }}>
        {[
          "Don't recolour outside the approved palette",
          "Don't stretch, skew or rotate",
          "Don't add drop shadows, glows, or effects",
          "Don't place solid logo on busy photography",
          "Don't reproduce below minimum size",
        ].map((d) => (
          <div key={d} style={{ padding: "0.875rem 1rem", border: "1px solid rgba(20,40,75,0.12)", fontSize: 13.5, color: "#26467d", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <X size={14} style={{ color: "#9c7a2f", flexShrink: 0, marginTop: 3 }} />
            <span>{d}</span>
          </div>
        ))}
      </div>

      <Callout variant="warning">
        <strong>🟡 Event & seasonal variations — in development.</strong> Bat Tours, Halloween, fireworks, etc. Guidelines to follow once the team has aligned. Do not create one-off logo variations without sign-off.
      </Callout>
    </>
  );
}

function LogoMark({ color = "#14284b", outline = false, size = 1 }) {
  // Stylised "S" mark inspired by punt prow + ripple
  const stroke = outline ? color : "none";
  const fill = outline ? "none" : color;
  const sw = outline ? 4 : 0;
  return (
    <svg viewBox="0 0 200 80" style={{ width: 200 * size, height: 80 * size }} xmlns="http://www.w3.org/2000/svg">
      {/* Decorative ribbon top */}
      <path d="M 10 18 L 190 18" stroke={color} strokeWidth={outline ? 1.2 : 1} opacity="0.6" fill="none" />
      <text
        x="100"
        y="50"
        textAnchor="middle"
        style={{ fontFamily: fontStack.display, fontWeight: 700, fontSize: 28, letterSpacing: "0.04em" }}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        paintOrder="stroke fill"
      >
        SCUDAMORE'S
      </text>
      <text
        x="100"
        y="68"
        textAnchor="middle"
        style={{ fontFamily: fontStack.body, fontWeight: 400, fontSize: 8, letterSpacing: "0.3em" }}
        fill={fill}
        stroke={stroke}
        strokeWidth={outline ? 0.5 : 0}
      >
        PUNTING · CAMBRIDGE · EST 1910
      </text>
      {/* Decorative ribbon bottom */}
      <path d="M 10 76 L 190 76" stroke={color} strokeWidth={outline ? 1.2 : 1} opacity="0.6" fill="none" />
    </svg>
  );
}

function LogoCard({ bg, border, solid, outline }) {
  return (
    <div
      style={{
        background: bg,
        padding: "3rem 2rem",
        border: border ? "1px solid rgba(20,40,75,0.12)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 240,
      }}
    >
      <LogoMark color={solid ? "#14284b" : "#fefefd"} outline={outline} />
      <div
        style={{
          marginTop: 24,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: solid ? "#9c7a2f" : "#e3c277",
          fontWeight: 500,
        }}
      >
        {solid ? "Solid · light backgrounds" : "Outline · dark backgrounds"}
      </div>
    </div>
  );
}

function ClearSpaceDemo({ level, label }) {
  return (
    <div style={{ background: "#fcfaf3", padding: "2rem 1.5rem", border: "1px dashed rgba(20,40,75,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
        <div style={{ position: "absolute", inset: 8, border: "1px dashed #c9a24a", opacity: 0.6 }} />
        <LogoMark color="#14284b" size={0.7} />
      </div>
      <div style={{ marginTop: 12, textAlign: "center" }}>
        <div style={{ fontFamily: fontStack.display, fontSize: 18, fontWeight: 700, color: "#14284b" }}>{level}</div>
        <div style={{ fontSize: 12, color: "#4e5d78", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

function MinSizeCard({ medium, min, note }) {
  return (
    <div style={{ padding: "1.5rem", background: "#fcfaf3", borderTop: "2px solid #c9a24a" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 12 }}>
        {medium}
      </div>
      <div style={{ fontFamily: fontStack.display, fontSize: 36, fontWeight: 700, color: "#14284b", lineHeight: 1 }}>{min}</div>
      <div style={{ fontSize: 13, color: "#4e5d78", marginTop: 8 }}>{note}</div>
    </div>
  );
}

// ─── SECTION: COLOUR ──────────────────────────────────────────────────────
function ColourSection() {
  return (
    <>
      <PageHeader
        num="03"
        eyebrow="Colour"
        title="Two anchors, three families."
        lede="The brand rests on Deep Navy and Off-White. Everything else extends from these — saturated navy ramp, warmer cream ramp, Lantern Gold accent."
      />

      <H2>Primary</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        {tokens.colors.primary.map((c) => (
          <SwatchLarge key={c.alias} {...c} />
        ))}
      </div>

      <H2>Navy ramp — saturated</H2>
      <P muted>Backgrounds, dividers, secondary type, UI states. The ramp keeps saturation high — no greyed-out tints.</P>
      <SwatchGrid swatches={tokens.colors.navy} />

      <H2>Cream ramp — warmer</H2>
      <P muted>Backgrounds, layered surfaces, premium print, warmth in customer-facing comms.</P>
      <SwatchGrid swatches={tokens.colors.cream} />

      <H2>Gold accent</H2>
      <P muted>Lantern light on the river at dusk. Use restrained, especially in fireworks, evening tours, and premium contexts.</P>
      <SwatchGrid swatches={tokens.colors.gold} />

      <H2>Tour mood cues</H2>
      <P muted>Tour branding stays anchored to the master palette. Each product can lean into a mood:</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <MoodCue title="Fireworks" bg="#0a1530" fg="#e3c277" desc="Deep Navy or Midnight backgrounds with Honey / Lantern Gold accents" />
        <MoodCue title="Bat tours" bg="#14284b" fg="#7e9bd5" desc="Midnight + Dusk with sparing Mist (twilight feel)" />
        <MoodCue title="Weddings" bg="#f8f3e3" fg="#9c7a2f" desc="Cream / Vellum backgrounds with Brass and Deep Navy" />
        <MoodCue title="Day tours" bg="#fefefd" fg="#14284b" desc="Master palette: Off-White or Cream + Deep Navy" border />
      </div>

      <H2>Accessibility — WCAG AA</H2>
      <P muted>Safe defaults below. For body copy, always pair a colour from the dark end (Midnight → Cam Blue) with one from the light end (Off-White → Stone, or Honey). Same-end pairings are decorative only.</P>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, margin: "1rem 0 2rem" }}>
        <ContrastCard bg="#14284b" fg="#fefefd" label="Off-White on Deep Navy" ratio="14.8:1" pass />
        <ContrastCard bg="#fefefd" fg="#14284b" label="Deep Navy on Off-White" ratio="14.8:1" pass />
        <ContrastCard bg="#0a1530" fg="#e3c277" label="Honey on Midnight" ratio="9.6:1" pass />
        <ContrastCard bg="#f8f3e3" fg="#9c7a2f" label="Brass on Cream" ratio="4.7:1" pass />
        <ContrastCard bg="#fefefd" fg="#7e9bd5" label="Sky on Off-White" ratio="2.8:1" />
        <ContrastCard bg="#f8f3e3" fg="#e3c277" label="Honey on Cream" ratio="1.4:1" />
      </div>
    </>
  );
}

function SwatchLarge({ name, alias, hex, rgb, cmyk }) {
  const [copied, setCopied] = useState(null);
  const isLight = ["#fefefd", "#fcfaf3", "#f8f3e3", "#f0e8cf", "#e7edf8", "#c2d0ec", "#e3c277"].includes(hex);
  const copyVal = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };
  return (
    <div className="swatch-card" style={{ display: "flex", flexDirection: "column", border: hex === "#fefefd" ? "1px solid rgba(20,40,75,0.12)" : "none" }}>
      <div style={{ background: hex, padding: "2.25rem 1.5rem", color: isLight ? "#14284b" : "#fefefd", minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: fontStack.display, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{name}</div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.65, fontFamily: fontStack.mono }}>{alias}</div>
        </div>
      </div>
      <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", borderTop: hex === "#fefefd" ? "none" : "none", padding: "0.875rem 1rem", fontSize: 12.5, fontFamily: fontStack.mono }}>
        <CopyRow label="HEX" value={hex} onCopy={() => copyVal(hex, "hex")} copied={copied === "hex"} />
        <CopyRow label="RGB" value={rgb} onCopy={() => copyVal(rgb, "rgb")} copied={copied === "rgb"} />
        <CopyRow label="CMYK" value={cmyk} onCopy={() => copyVal(cmyk, "cmyk")} copied={copied === "cmyk"} />
      </div>
    </div>
  );
}

function CopyRow({ label, value, onCopy, copied }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(20,40,75,0.06)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", color: "#26467d", flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#9c7a2f", textTransform: "uppercase", minWidth: 36 }}>{label}</span>
        <span style={{ color: "#14284b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
      </div>
      <button onClick={onCopy} className="copy-btn" style={{ border: "none", background: "transparent", cursor: "pointer", padding: 4, display: "flex", color: copied ? "#3d68b0" : "#9c7a2f", borderRadius: 3 }}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  );
}

function SwatchGrid({ swatches }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: "2rem" }}>
      {swatches.map((s) => (
        <SwatchSmall key={s.alias} {...s} />
      ))}
    </div>
  );
}

function SwatchSmall({ name, alias, hex, rgb }) {
  const [copied, setCopied] = useState(false);
  const isLight = ["#fefefd", "#fcfaf3", "#f8f3e3", "#f0e8cf", "#e6d9b3", "#e7edf8", "#c2d0ec", "#7e9bd5", "#e3c277", "#d4c8a6"].includes(hex);
  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      onClick={copy}
      className="swatch-card"
      style={{
        background: hex,
        border: hex === "#fefefd" ? "1px solid rgba(20,40,75,0.12)" : "none",
        padding: "1rem 0.875rem",
        textAlign: "left",
        cursor: "pointer",
        color: isLight ? "#14284b" : "#fefefd",
        minHeight: 110,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: fontStack.body,
      }}
    >
      <div>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{name}</div>
        <div style={{ fontSize: 10, opacity: 0.7, fontFamily: fontStack.mono, letterSpacing: "0.05em", marginTop: 2 }}>{alias}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: fontStack.mono, fontSize: 11.5 }}>{hex}</span>
        {copied ? <Check size={12} /> : <Copy size={12} style={{ opacity: 0.5 }} />}
      </div>
    </button>
  );
}

function MoodCue({ title, bg, fg, desc, border }) {
  return (
    <div style={{ background: bg, color: fg, padding: "1.25rem 1.25rem 1.5rem", border: border ? "1px solid rgba(20,40,75,0.12)" : "none", minHeight: 120 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, opacity: 0.85, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.5, color: title === "Day tours" ? "#26467d" : fg, opacity: title === "Day tours" ? 1 : 0.9 }}>{desc}</div>
    </div>
  );
}

function ContrastCard({ bg, fg, label, ratio, pass }) {
  return (
    <div style={{ background: bg, color: fg, padding: "1.5rem 1.25rem", border: bg === "#fefefd" ? "1px solid rgba(20,40,75,0.12)" : "none" }}>
      <div style={{ fontFamily: fontStack.display, fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>Aa</div>
      <div style={{ fontSize: 14, marginTop: 12, lineHeight: 1.5 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        <span style={{ fontFamily: fontStack.mono }}>{ratio}</span>
        <span style={{ fontWeight: 500, color: pass ? fg : "#9c7a2f" }}>{pass ? "✓ AA" : "Decorative only"}</span>
      </div>
    </div>
  );
}

// ─── SECTION: TYPOGRAPHY ──────────────────────────────────────────────────
function TypographySection() {
  const specimens = [
    { label: "H1 — Hero", font: "Gill Sans Bold", size: 56, weight: 700, family: fontStack.display, lh: 1.05, ls: "-0.02em", text: "Punting gently down the Cam since 1910" },
    { label: "H2 — Section head", font: "Gill Sans Bold", size: 36, weight: 700, family: fontStack.display, lh: 1.15, ls: "-0.01em", text: "Where Cambridge goes punting" },
    { label: "H3 — Subhead", font: "Inter Semibold", size: 22, weight: 600, family: fontStack.body, lh: 1.3, ls: "0", text: "Crafting timeless Cambridge memories" },
    { label: "H4 — Section label", font: "Inter Semibold", size: 16, weight: 600, family: fontStack.body, lh: 1.4, ls: "0", text: "Our heritage on the river" },
    { label: "Eyebrow / overline", font: "Inter Medium · UPPERCASE", size: 12, weight: 500, family: fontStack.body, lh: 1.4, ls: "0.15em", text: "FIREWORKS TOUR · MAY BALL SEASON", color: "#9c7a2f" },
    { label: "Body large", font: "Inter Regular 18", size: 18, weight: 400, family: fontStack.body, lh: 1.6, ls: "0", text: "Drift quietly past the colleges as twilight settles on the river. Our chauffeurs have been showing visitors this view for over a century." },
    { label: "Body default", font: "Inter Regular 15", size: 15, weight: 400, family: fontStack.body, lh: 1.6, ls: "0", text: "Scudamore's has been Cambridge's oldest punting company since 1910. From shared chauffeured tours to private hire, fireworks evenings to bat safaris." },
    { label: "Caption", font: "Inter Regular 12", size: 12, weight: 400, family: fontStack.body, lh: 1.5, ls: "0", color: "#4e5d78", text: "Image: Granta Place, Mill Lane. Photograph by [photographer], 2025." },
  ];

  return (
    <>
      <PageHeader
        num="04"
        eyebrow="Typography"
        title="Heritage warmth, modern clarity."
        lede="Gill Sans Bold for headlines and the brand name. Inter for everything that works — subheads, body, UI, captions."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: "2.5rem" }}>
        <FontShowcase
          name="Gill Sans Bold"
          role="Display & headlines"
          family={fontStack.display}
          weight={700}
          rationale="Humanist warmth, slight heritage character — the voice of someone who has been on this river for a hundred years."
        />
        <FontShowcase
          name="Inter"
          role="Body, UI, captions"
          family={fontStack.body}
          weight={400}
          rationale="Contemporary neo-grotesque, designed for screens. Free, open-source. Carries the modern."
        />
      </div>

      <H2>Hierarchy</H2>
      <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", padding: "2rem", marginBottom: "2rem" }}>
        {specimens.map((s, i) => (
          <div key={i} style={{ paddingBottom: i === specimens.length - 1 ? 0 : 28, marginBottom: i === specimens.length - 1 ? 0 : 28, borderBottom: i === specimens.length - 1 ? "none" : "1px solid rgba(20,40,75,0.08)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 8 }}>
              {s.label}
            </div>
            <div
              style={{
                fontFamily: s.family,
                fontSize: s.size,
                fontWeight: s.weight,
                lineHeight: s.lh,
                letterSpacing: s.ls,
                color: s.color || "#14284b",
                marginBottom: 6,
                textTransform: s.label.includes("Eyebrow") ? "uppercase" : "none",
              }}
            >
              {s.text}
            </div>
            <div style={{ fontFamily: fontStack.mono, fontSize: 11, color: "#8993a5" }}>
              {s.font} · {s.size}pt · line-height {s.lh}
            </div>
          </div>
        ))}
      </div>

      <H2>Casing rules</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, margin: "1rem 0 2rem" }}>
        <CaseCard label="Default" sample="Where Cambridge goes punting" rule="Sentence case for headlines, subheads, body." />
        <CaseCard label="Brand stamp" sample="SCUDAMORE'S" rule="ALL CAPS only for the brand name with logo, eyebrows, dividers." display />
        <CaseCard label="Avoid" sample="Where Cambridge Goes Punting" rule="Title Case feels old-fashioned. Avoid for headings." cross />
      </div>

      <H2>Tracking</H2>
      <div style={{ background: "#fcfaf3", padding: "1.5rem", marginBottom: "2rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(20,40,75,0.15)" }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500 }}>Context</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500 }}>Tracking</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Hero / display headlines (40pt+)", "−2%"],
              ["Mid display (24–40pt)", "−1%"],
              ["Body, UI, subheads", "0 (default)"],
              ["Brand name in caps, eyebrows, dividers", "+15%"],
            ].map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(20,40,75,0.06)" }}>
                <td style={{ padding: "10px 12px" }}>{row[0]}</td>
                <td style={{ padding: "10px 12px", fontFamily: fontStack.mono, color: "#3d68b0" }}>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>House style</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {[
          { t: "British English", d: "colour, organisation, towards. Oxford comma optional." },
          { t: "Smart quotes", d: "'Curly' apostrophes. Never 'straight'. Always Scudamore's." },
          { t: "Em dashes", d: "Used freely — with spaces around them — like this." },
          { t: "Tabular figures", d: "For prices, dates, tables. Proportional in prose." },
          { t: "Italics for emphasis only", d: "Never for titles of works." },
          { t: "Bold sparingly", d: "For genuine emphasis or UI labels — never decoration." },
        ].map((it) => (
          <div key={it.t} style={{ padding: "1rem 1.25rem", background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#14284b", marginBottom: 4 }}>{it.t}</div>
            <div style={{ fontSize: 13, color: "#4e5d78", lineHeight: 1.5 }}>{it.d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function FontShowcase({ name, role, family, weight, rationale }) {
  return (
    <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", padding: "2rem 1.75rem" }}>
      <div style={{ fontFamily: family, fontWeight: weight, fontSize: 80, lineHeight: 1, color: "#14284b", marginBottom: 16, letterSpacing: "-0.02em" }}>
        Aa
      </div>
      <div style={{ fontFamily: fontStack.display, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 16 }}>{role}</div>
      <div style={{ fontSize: 13.5, color: "#4e5d78", lineHeight: 1.55 }}>{rationale}</div>
    </div>
  );
}

function CaseCard({ label, sample, rule, display, cross }) {
  return (
    <div style={{ padding: "1.5rem 1.25rem", background: "#fcfaf3", borderTop: cross ? "2px solid rgba(156, 122, 47, 0.5)" : "2px solid #c9a24a", opacity: cross ? 0.7 : 1 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 12 }}>{label}</div>
      <div style={{ fontFamily: display ? fontStack.display : fontStack.body, fontSize: display ? 24 : 18, fontWeight: display ? 700 : 600, color: "#14284b", marginBottom: 12, letterSpacing: display ? "0.05em" : 0, textDecoration: cross ? "line-through" : "none", textDecorationColor: "#9c7a2f", textDecorationThickness: 1.5 }}>
        {sample}
      </div>
      <div style={{ fontSize: 12.5, color: "#4e5d78", lineHeight: 1.5 }}>{rule}</div>
    </div>
  );
}

// ─── SECTION: VOICE ───────────────────────────────────────────────────────
function VoiceSection() {
  const traits = [
    { name: "Warm", desc: "Like an informed friend showing you their city. Not a tour guide. Not a brochure.", sample: "Wrap up warm — the Cam holds the cold long after the air's turned. There'll be blankets in the punt." },
    { name: "Quietly confident", desc: "We don't claim. We mention. The heritage is bedrock; we don't have to keep tapping on it.", sample: "Cambridge's oldest punting company. Founded 1910, family-run ever since." },
    { name: "Knowledgeable", desc: "We name the colleges. We know which bridges are which. Specificity is a love language.", sample: "Stop on the Bridge of Sighs side and you'll see the wisteria coming through in late May." },
    { name: "Unfussy", desc: "Short sentences. Plain words. We say 'punt,' not 'vessel.' If a sentence sounds like a brochure, we cut it.", sample: "Two hours on the Cam, a chauffeur who knows the river, and a flask of something warm if it's chilly." },
    { name: "Playful", desc: "There's a twinkle. Dry, occasional, confident enough not to push.", sample: "Yes, you can fall in. No, you almost certainly won't." },
  ];

  const channels = [
    { ch: "Website hero", tone: "Anchored, evocative, declarative", sample: "Where Cambridge goes punting. Founded 1910, family-run since." },
    { ch: "Booking confirmation", tone: "Quietly confident, useful, friendly", sample: "You're booked. Saturday 14 June, 6pm, Mill Lane. Wrap up warm — the Cam holds the cold long after the air's turned. Any questions, just reply." },
    { ch: "Newsletter", tone: "Warm, slow, evocative", sample: "The May Balls have started. From the river, you can see the marquee lights catching on the water before you can hear the music." },
    { ch: "Instagram caption", tone: "Playful, specific, light", sample: "Punt no. 17, taken out for her first run of the season this morning. She's been with us since 1962 and she's still the prettiest in the yard." },
    { ch: "Customer service", tone: "Plainspoken, generous, calm", sample: "Sorry to hear that — let's sort it out. Could you send over your booking reference and I'll find you in the system?" },
    { ch: "Internal Slack", tone: "Playful, retro, dry", sample: "Right, fireworks rota's up. Three evenings, four chauffeurs, one flask of tea per boat. Speak now or forever pretend you didn't see this." },
  ];

  return (
    <>
      <PageHeader
        num="05"
        eyebrow="Voice"
        title="The voice of someone who's been here a hundred years."
        lede="The voice of an informed friend showing you their city. Quietly confident, never shouting, with specificity as a love language."
      />

      <div style={{ background: "#14284b", color: "#fefefd", padding: "3rem 2.5rem", marginBottom: "2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#e3c277", marginBottom: 16, fontWeight: 500 }}>
          The voice in miniature
        </div>
        <div style={{ fontFamily: fontStack.display, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.015em" }}>
          "Where Cambridge<br />goes punting."
        </div>
        <div style={{ fontSize: 14, color: "#c2d0ec", marginTop: 24, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          Anchored. Declarative. Locals-first. Four words that say everything: trusted, established, for Cambridge before anyone else.
        </div>
      </div>

      <H2>Voice traits</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "2rem" }}>
        {traits.map((t, i) => (
          <div key={t.name} style={{ display: "grid", gridTemplateColumns: "minmax(140px, 220px) 1fr", gap: 32, padding: "1.75rem 0", borderTop: i === 0 ? "1px solid rgba(20,40,75,0.12)" : "none", borderBottom: "1px solid rgba(20,40,75,0.12)" }}>
            <div>
              <div style={{ fontFamily: fontStack.display, fontSize: 24, fontWeight: 700, color: "#14284b" }}>{t.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 14.5, lineHeight: 1.65, color: "#26467d", marginBottom: 14 }}>{t.desc}</div>
              <div style={{ fontFamily: fontStack.display, fontStyle: "italic", fontSize: 17, lineHeight: 1.45, color: "#9c7a2f", paddingLeft: 16, borderLeft: "2px solid #c9a24a" }}>
                "{t.sample}"
              </div>
            </div>
          </div>
        ))}
      </div>

      <Callout>
        <strong>The sniff test:</strong> before publishing, ask "Could a competitor publish this sentence verbatim?" If yes, rewrite it. The voice should be unmistakably Scudamore's — specific where they're generic, calm where they're loud.
      </Callout>

      <H2>Tone by channel</H2>
      <div style={{ background: "#fcfaf3", padding: 0, marginBottom: "2rem", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#14284b", color: "#fefefd" }}>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>Channel</th>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>Tone</th>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>Sample</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c, i) => (
              <tr key={c.ch} style={{ borderBottom: "1px solid rgba(20,40,75,0.08)", background: i % 2 === 0 ? "transparent" : "rgba(254,254,253,0.5)" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, verticalAlign: "top", whiteSpace: "nowrap" }}>{c.ch}</td>
                <td style={{ padding: "14px 16px", color: "#26467d", verticalAlign: "top" }}>{c.tone}</td>
                <td style={{ padding: "14px 16px", fontStyle: "italic", color: "#26467d", verticalAlign: "top", lineHeight: 1.55 }}>"{c.sample}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Be mindful of</H2>
      <P muted>Not banned, but flagged for a closer look. These are the patterns that drift the voice toward generic tourism-brand or AI-generated copy.</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <MindfulCard title="Competitor language" items={["'Let's go punting' (competitor name)", "'Glide along the river'", "'Cam River' — it's the Cam"]} />
        <MindfulCard title="AI / marketing-speak patterns" items={["Sentences a competitor could publish", "Stacked adjectives: 'stunning, beautiful, unforgettable'", "'Proud to announce/partner...'", "Apologetic 'We hope you'll join us!'"]} />
        <MindfulCard title="Tourism cliches (sparingly)" items={["Unforgettable, iconic, authentic", "Hidden gem, bucket-list", "Step back in time, timeless tradition"]} note="Use only when accurate." />
      </div>

      <Callout variant="warning">
        <strong>🟡 Scudamore's-isms vocabulary list — to discuss with team.</strong> The Cam vs the river Cam, chauffeur vs guide, punt vs boat, naming colleges. Awaiting team alignment.
      </Callout>
    </>
  );
}

function MindfulCard({ title, items, note }) {
  return (
    <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", padding: "1.25rem 1.25rem 1.5rem" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 14 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <li key={it} style={{ fontSize: 13, color: "#26467d", lineHeight: 1.5, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 1, background: "#c9a24a" }} />
            {it}
          </li>
        ))}
      </ul>
      {note && <div style={{ fontSize: 12, fontStyle: "italic", color: "#4e5d78", marginTop: 12 }}>{note}</div>}
    </div>
  );
}

// ─── SECTION: PHOTOGRAPHY ─────────────────────────────────────────────────
function PhotographySection() {
  return (
    <>
      <PageHeader
        num="06"
        eyebrow="Photography"
        title="The edit should disappear."
        lede="A mix — we shoot whatever the day gives us. The unifying factor is restraint in the edit, not a single look."
      />

      <H2>Visual personality</H2>
      <P>Some days the Cam is mist and dusk; some days it's hard sun on King's Chapel. Both are Scudamore's. The job of every shoot and every edit is to make the variety feel like one body of work.</P>
      <Callout>
        <strong>Our experiences are picturesque enough that the edit should disappear.</strong> If a photo looks "edited," we've gone too far.
      </Callout>

      <H2>Editing</H2>
      <ul style={{ margin: "1rem 0 2rem", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
        {[
          "Natural — minimal grading, true to what the eye saw on the day",
          "Slight lifts to saturation and contrast where needed",
          "No heavy filters, no fashion-style colour grades, no 'tourism teal-and-orange'",
          "White balance honest to the time of day",
        ].map((it) => (
          <li key={it} style={{ fontSize: 14.5, lineHeight: 1.6, color: "#26467d", paddingLeft: 20, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 11, width: 8, height: 1, background: "#c9a24a" }} />
            {it}
          </li>
        ))}
      </ul>

      <H2>Aspect ratios — required formats</H2>
      <P muted>Every key shot must exist in horizontal AND vertical masters. Shoot wide, crop in.</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <RatioCard ratio="16:9" use="Web hero, banner, YouTube" />
        <RatioCard ratio="1:1" use="Instagram feed, square posts" />
        <RatioCard ratio="9:16" use="Stories, Reels, TikTok, posters" />
        <RatioCard ratio="A2/A3" use="Print posters" />
        <RatioCard ratio="3:1" use="Email header" />
      </div>

      <H2>Subjects</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <SubjectCard
          title="People"
          eyebrow="Candid + considered"
          items={["Customers visibly enjoying themselves", "Chauffeurs at work — mid-pole-stroke", "Quiet moments — fingers in the water", "Group dynamics, social warmth", "Anonymous figures — silhouettes, hands"]}
          note="Staff used as models. Wardrobe: pop of colour against the river palette (red coat, mustard scarf)."
        />
        <SubjectCard
          title="Products"
          eyebrow="Punts, kit, the boatyard"
          items={["Hero: chauffeur tour at Bridge of Sighs / King's", "Self-hire by King's College Chapel", "Punt detail — woodgrain, prow, ripples", "Kit — poles, blankets, flasks", "Heritage detail — brass, painted name"]}
        />
        <SubjectCard
          title="Places"
          eyebrow="Cambridge, on and off the postcard"
          items={["Hero: King's College Chapel + Bridge of Sighs", "Named colleges — King's, Trinity, St John's", "Named bridges — Mathematical, Magdalene", "Hidden Cambridge — dawn, winter Backs", "Seasons & wildlife — bats, ducks, frost"]}
        />
      </div>

      <Callout variant="warning">
        <strong>⚠️ Consent & identifiable people — working understanding, not legal advice.</strong> Chauffeurs photographed in detail (covered by employment contract). Customers anonymous by default. Identifiable customer shots need signed release. Children under 18 need parental consent; under 13 cannot consent themselves. When in doubt — particularly weddings, partnerships, children — get sign-off before publishing.
      </Callout>
    </>
  );
}

function RatioCard({ ratio, use }) {
  const [w, h] = ratio.split(":").map((n) => parseFloat(n));
  const isText = isNaN(w);
  const aspectStyle = isText ? { aspectRatio: "1 / 1.41" } : { aspectRatio: `${w} / ${h}` };
  return (
    <div style={{ padding: "1rem 1rem 1.25rem", background: "#fcfaf3", borderTop: "2px solid #c9a24a" }}>
      <div style={{ ...aspectStyle, background: "#14284b", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: fontStack.display, fontSize: 18, fontWeight: 700, color: "#e3c277" }}>{ratio}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "#26467d", lineHeight: 1.45 }}>{use}</div>
    </div>
  );
}

function SubjectCard({ title, eyebrow, items, note }) {
  return (
    <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", padding: "1.5rem 1.5rem 1.75rem" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 6 }}>{eyebrow}</div>
      <div style={{ fontFamily: fontStack.display, fontSize: 26, fontWeight: 700, color: "#14284b", marginBottom: 14 }}>{title}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <li key={it} style={{ fontSize: 13, color: "#26467d", lineHeight: 1.5, paddingLeft: 14, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 1, background: "#c9a24a" }} />
            {it}
          </li>
        ))}
      </ul>
      {note && <div style={{ fontSize: 12, fontStyle: "italic", color: "#4e5d78", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(20,40,75,0.08)", lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

// ─── SECTION: GRAPHICS & ICONS ────────────────────────────────────────────
function GraphicsSection() {
  return (
    <>
      <PageHeader
        num="07"
        eyebrow="Graphics & icons"
        title="Restraint, with the right details."
        lede="Photography does the heavy lifting. Illustrations, decorative elements, and icons supplement — they don't compete."
      />

      <H2>Illustration</H2>
      <Callout variant="warning">
        <strong>🟡 Placeholder — to define.</strong> We use illustration occasionally but don't have a documented style. Working principles: heritage-leaning (engraved / etched / linocut feel), two-tone (Navy + Cream or Navy + Lantern Gold), supplements photography rather than replacing it.
      </Callout>

      <H2>Vintage & archive imagery</H2>
      <P>Where we hold the rights, vintage imagery is one of the most distinctive assets the brand has. <strong>Rights first.</strong> Treat respectfully. Pair, don't paste — vintage works best alongside contemporary photography.</P>

      <H2>Icons</H2>
      <P muted>No single icon system yet. Approved libraries for now:</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <IconLibCard name="Lucide" use="Web / product UI" note="Already in use via shadcn" />
        <IconLibCard name="Phosphor" use="Marketing, Figma" note="Multiple weights, more character" />
        <IconLibCard name="Tabler" use="Dashboards, dense UI" note="~5800 icons, free, outline" />
        <IconLibCard name="Bespoke" use="Punting / Cambridge specific" note="Custom set in development" />
      </div>

      <H2>Style rules — working draft</H2>
      <ul style={{ margin: "1rem 0 2rem", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
        {[
          "Outline by default — solid only for semantic weight",
          "Consistent weight within a piece — no mixing thin and bold",
          "Sizing: 16px (UI inline), 20px (default), 24px (touch), 32px+ (feature)",
          "Colour: Deep Navy default, Lantern Gold for interactive, Off-White on dark",
          "Stroke width: 1.5–2px at standard sizes",
        ].map((it) => (
          <li key={it} style={{ fontSize: 14.5, lineHeight: 1.6, color: "#26467d", paddingLeft: 20, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 11, width: 8, height: 1, background: "#c9a24a" }} />
            {it}
          </li>
        ))}
      </ul>

      <H2>Decorative elements</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <DecoCard title="Hairline rules" desc="0.5px Deep Navy lines for dividing sections. Never thicker than 1px." />
        <DecoCard title="Lantern Gold accent rule" desc="Short (40–60mm) horizontal line under section labels for editorial moments." />
        <DecoCard title="'est. 1910' lockup" desc="Small caps text mark alongside the logo on heritage-led pieces." />
        <DecoCard title="Watermark" desc="Icon-only logo at 10–15% opacity for letterhead, certificates." />
      </div>
    </>
  );
}

function IconLibCard({ name, use, note }) {
  return (
    <div style={{ padding: "1.25rem", background: "#fcfaf3", borderTop: "2px solid #c9a24a" }}>
      <div style={{ fontFamily: fontStack.display, fontSize: 20, fontWeight: 700, color: "#14284b", marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 13, color: "#26467d", marginBottom: 8 }}>{use}</div>
      <div style={{ fontSize: 12, fontStyle: "italic", color: "#9c7a2f" }}>{note}</div>
    </div>
  );
}

function DecoCard({ title, desc }) {
  return (
    <div style={{ padding: "1.25rem 1.25rem 1.5rem", background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#14284b", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#4e5d78", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

// ─── SECTION: CHARTS ──────────────────────────────────────────────────────
function ChartsSection() {
  return (
    <>
      <PageHeader
        num="08"
        eyebrow="Charts & data viz"
        title="When in doubt, one colour."
        lede="Minimal and editorial — closer to the FT than to a default Excel chart. The story should come from the data, not from the colours."
      />

      <H2>The default chart</H2>
      <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", padding: "2rem 2rem 1.5rem", marginBottom: "2rem" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9c7a2f", fontWeight: 500, marginBottom: 6 }}>
          BOOKINGS · 2025
        </div>
        <div style={{ fontFamily: fontStack.display, fontSize: 26, fontWeight: 700, color: "#14284b", marginBottom: 4 }}>
          A strong second half
        </div>
        <div style={{ fontSize: 13.5, color: "#4e5d78", marginBottom: 24 }}>
          Quarterly bookings, with Q3 highlighted — fireworks season delivered.
        </div>
        <BarChart />
        <div style={{ fontSize: 11, color: "#3d68b0", marginTop: 16, fontFamily: fontStack.mono }}>
          Source: Internal bookings data, 2025
        </div>
      </div>

      <H2>Colour use</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        <RuleCard num="1" rule="Single colour by default" desc="Deep Navy for everything. The data should be the story." />
        <RuleCard num="2" rule="One highlight, Lantern Gold" desc="When emphasising a single point, the rest stays Deep Navy." />
        <RuleCard num="3" rule="Sequential? Use the navy ramp" desc="Deep Navy → Dusk → Cam Blue → Sky → Mist for ordered data." />
        <RuleCard num="4" rule="Categorical? Up to 4 categories" desc="Deep Navy, Lantern Gold, Cam Blue, Stone — in priority order." />
      </div>

      <H2>Always include</H2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: "2rem" }}>
        {[
          "A clear title (in surrounding type, not in the chart)",
          "Axis labels with units",
          "A source if data is external",
          "The date or period",
        ].map((it) => (
          <div key={it} style={{ padding: "0.875rem 1rem", border: "1px solid rgba(20,40,75,0.12)", fontSize: 13, color: "#26467d", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Check size={14} style={{ color: "#3d68b0", flexShrink: 0, marginTop: 3 }} />
            <span>{it}</span>
          </div>
        ))}
      </div>

      <H2>The honesty rules</H2>
      <ul style={{ margin: "1rem 0 2rem", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, maxWidth: 680 }}>
        {[
          "Y-axis starts at zero for bar charts, always",
          "Pie chart slices add to 100% — don't omit 'Other' silently",
          "Don't dual-axis unless the two scales are genuinely related",
          "Round consistently — don't show 47.3% next to 51%",
        ].map((it) => (
          <li key={it} style={{ fontSize: 14.5, lineHeight: 1.6, color: "#26467d", paddingLeft: 20, position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 11, width: 8, height: 1, background: "#c9a24a" }} />
            {it}
          </li>
        ))}
      </ul>
    </>
  );
}

function BarChart() {
  const data = [
    { label: "Q1", value: 42, highlight: false },
    { label: "Q2", value: 68, highlight: false },
    { label: "Q3", value: 95, highlight: true },
    { label: "Q4", value: 76, highlight: false },
  ];
  const max = 100;
  const w = 600;
  const h = 220;
  const padL = 36;
  const padB = 32;
  const padT = 12;
  const chartW = w - padL - 8;
  const chartH = h - padB - padT;
  const bw = (chartW / data.length) * 0.55;
  const gap = (chartW / data.length) * 0.45;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 600, height: "auto", display: "block" }}>
      {[0, 25, 50, 75, 100].map((y) => (
        <g key={y}>
          <line x1={padL} y1={padT + chartH - (y / max) * chartH} x2={w - 8} y2={padT + chartH - (y / max) * chartH} stroke="#c2d0ec" strokeWidth="0.5" />
          <text x={padL - 8} y={padT + chartH - (y / max) * chartH + 4} textAnchor="end" fontSize="10" fill="#26467d" fontFamily={fontStack.mono}>
            {y}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = padL + (chartW / data.length) * i + gap / 2;
        const bh = (d.value / max) * chartH;
        const y = padT + chartH - bh;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={bw} height={bh} fill={d.highlight ? "#c9a24a" : "#14284b"} />
            <text x={x + bw / 2} y={padT + chartH + 18} textAnchor="middle" fontSize="11" fill="#26467d" fontFamily={fontStack.body}>
              {d.label}
            </text>
            <text x={x + bw / 2} y={y - 6} textAnchor="middle" fontSize="11" fill="#14284b" fontFamily={fontStack.mono} fontWeight="500">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RuleCard({ num, rule, desc }) {
  return (
    <div style={{ padding: "1.25rem", background: "#fcfaf3", borderTop: "2px solid #c9a24a" }}>
      <div style={{ fontFamily: fontStack.mono, fontSize: 11, color: "#9c7a2f", letterSpacing: "0.1em", marginBottom: 6 }}>RULE 0{num}</div>
      <div style={{ fontFamily: fontStack.display, fontSize: 17, fontWeight: 700, color: "#14284b", marginBottom: 6, lineHeight: 1.3 }}>{rule}</div>
      <div style={{ fontSize: 13, color: "#4e5d78", lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

// ─── SECTION: APPLICATIONS ────────────────────────────────────────────────
function ApplicationsSection() {
  const products = {
    "Chauffeured Tours": ["Private College Backs", "Shared College Backs", "Grantchester"],
    "Boat Hire (Self-hire)": ["Punt Hire — College Backs & Grantchester", "Canoe Hire — Grantchester", "Kayak Hire — Grantchester", "Paddle Board Hire — Grantchester"],
    "Punting Experiences": ["Gin Punting", "Treasure Hunt", "Afternoon Tea", "Punt & Walk", "Romantic & Wedding", "Bat Safari", "Champagne", "Fireworks"],
    "Punting for Groups": ["School", "Corporate", "Hen Party", "Celebration"],
    Other: ["Gift Vouchers", "Community"],
  };

  const seasons = [
    { name: "Spring", months: "Mar–May", note: "Blossoms, May Bumps, May Balls, ducklings", bg: "#f8f3e3", fg: "#9c7a2f" },
    { name: "Summer", months: "Jun–Aug", note: "Peak season, weddings, champagne, school groups", bg: "#e7edf8", fg: "#3d68b0" },
    { name: "Autumn", months: "Sep–Nov", note: "Fireworks, golden light, leaves on the water", bg: "#fef3e3", fg: "#9c7a2f" },
    { name: "Winter", months: "Dec–Feb", note: "Quieter river, frost, gift vouchers, Christmas (closed Christmas Day)", bg: "#e7edf8", fg: "#26467d" },
  ];

  return (
    <>
      <PageHeader
        num="09"
        eyebrow="Brand applications"
        title="Show, don't tell."
        lede="Real-world examples of the brand applied across digital and print, structured around the actual product categories on the website. Designed to grow as assets are produced."
      />

      <Callout>
        <strong>Reminder:</strong> when designing for a specific product, always check <a href="https://www.scudamores.com" style={{ color: "#9c7a2f", fontWeight: 500 }}>scudamores.com</a> first to confirm the current name, copy, and positioning. Don't invent products.
      </Callout>

      <H2>Real product structure</H2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "2rem" }}>
        {Object.entries(products).map(([cat, items]) => (
          <div key={cat} style={{ background: "#fcfaf3", padding: "1.25rem 1.5rem", borderLeft: "2px solid #c9a24a" }}>
            <div style={{ fontFamily: fontStack.display, fontSize: 18, fontWeight: 700, color: "#14284b", marginBottom: 10 }}>{cat}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {items.map((it) => (
                <span key={it} style={{ fontSize: 12.5, padding: "4px 10px", background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", color: "#26467d", borderRadius: 2 }}>
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <H2>Seasonal variations</H2>
      <P muted>Every key application — posters, social, email, hero photography — should be planned across all four seasons of the Cam.</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8, marginBottom: "2rem" }}>
        {seasons.map((s) => (
          <div key={s.name} style={{ background: s.bg, padding: "1rem 1.25rem 1.25rem", minHeight: 120 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: s.fg, fontWeight: 500 }}>{s.months}</div>
            <div style={{ fontFamily: fontStack.display, fontSize: 22, fontWeight: 700, color: "#14284b", margin: "4px 0 8px" }}>{s.name}</div>
            <div style={{ fontSize: 12.5, color: "#26467d", lineHeight: 1.5 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <H2>Status legend</H2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: "1.5rem", fontSize: 13 }}>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#3d68b0" }}>✅ Live</span><span style={{ color: "#4e5d78" }}>example exists</span></span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#9c7a2f" }}>🟡 To produce</span><span style={{ color: "#4e5d78" }}>category defined, asset pending</span></span>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ color: "#9c7a2f" }}>⚠️ Needs review</span><span style={{ color: "#4e5d78" }}>off-brand drift</span></span>
      </div>

      <H2>Digital applications</H2>
      <ApplicationGrid items={[
        { name: "Website — homepage", status: "live", note: "Hero, product cards, seasonal rotation" },
        { name: "Website — product pages", status: "review", note: "Live, design audit recommended" },
        { name: "Booking flow", status: "review", note: "Lucide icons via shadcn" },
        { name: "Email — newsletter", status: "todo", note: "Template to formalise" },
        { name: "Email — booking confirmation", status: "todo", note: "Tabular figures, warm closing" },
        { name: "Instagram feed (1:1)", status: "live", note: "@puntingcambridge — visual audit" },
        { name: "Stories & Reels (9:16)", status: "todo", note: "Template kit needed" },
        { name: "YouTube channel art", status: "review", note: "@ScudamoresPunts" },
        { name: "Paid social ads", status: "todo", note: "Lantern Gold CTA, no hard-sell" },
        { name: "Google display ads", status: "todo", note: "Multiple sizes" },
        { name: "Internal dashboards", status: "live", note: "shadcn extended with brand palette" },
        { name: "Slide template", status: "todo", note: "Title, divider, content, chart, image, close" },
      ]} />

      <H2>Print applications</H2>
      <ApplicationGrid items={[
        { name: "Letterhead", status: "todo", note: "A4, navy mark, Mill Lane address" },
        { name: "Business cards", status: "todo", note: "85×55mm, navy front, cream reverse" },
        { name: "Compliments slips", status: "todo", note: "DL format" },
        { name: "Tickets", status: "todo", note: "Per product, tabular figures" },
        { name: "Gift vouchers", status: "review", note: "Cream stock, Brass + Navy" },
        { name: "Product posters", status: "todo", note: "A2/A3 vertical, per product line" },
        { name: "Event posters", status: "todo", note: "May Bumps, fireworks, Bat Safari" },
        { name: "Boatyard signage", status: "review", note: "Wayfinding, pricing, hours" },
        { name: "On-river signage", status: "review", note: "Self-hire wayfinding" },
        { name: "Visitor brochures", status: "todo", note: "A5/DL with map of the Backs" },
        { name: "Wedding collateral", status: "todo", note: "Cream stock, Brass + Navy" },
        { name: "Staff uniform", status: "live", note: "See Photography wardrobe note" },
      ]} />

      <H2>Follow-ups</H2>
      <P muted>Items captured during the brand guidelines workshop that need follow-up work to fully complete:</P>
      <ol style={{ margin: "1rem 0 2rem", paddingLeft: 20, color: "#26467d", fontSize: 14, lineHeight: 1.7, maxWidth: 720 }}>
        <li>AI usage policy for branding, design and marketing</li>
        <li>Scudamore's-isms vocabulary list — needs team workshop</li>
        <li>Event / seasonal logo variations — Bat Tours, Halloween, fireworks</li>
        <li>Custom icon set development — bespoke punting icons</li>
        <li>Illustration style — placeholder until team aligns</li>
        <li>Vintage imagery rights audit</li>
        <li>Photography rights & consent — confirm staff contracts, document release form</li>
        <li>Email, slide and ad template kits — multiple 🟡 items</li>
        <li>Existing assets audit — items marked ⚠️ need a design pass</li>
      </ol>
    </>
  );
}

function ApplicationGrid({ items }) {
  const colorMap = {
    live: { dot: "#3d68b0", label: "Live" },
    todo: { dot: "#c9a24a", label: "To produce" },
    review: { dot: "#9c7a2f", label: "Needs review" },
  };
  return (
    <div style={{ background: "#fefefd", border: "1px solid rgba(20,40,75,0.12)", marginBottom: "2rem" }}>
      {items.map((it, i) => (
        <div key={it.name} style={{ display: "grid", gridTemplateColumns: "16px 1fr auto", gap: 16, alignItems: "center", padding: "0.875rem 1.25rem", borderBottom: i === items.length - 1 ? "none" : "1px solid rgba(20,40,75,0.08)" }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: colorMap[it.status].dot }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#14284b" }}>{it.name}</div>
            <div style={{ fontSize: 12.5, color: "#4e5d78", marginTop: 2 }}>{it.note}</div>
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colorMap[it.status].dot, fontWeight: 500, fontFamily: fontStack.mono }}>
            {colorMap[it.status].label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(20,40,75,0.12)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
      <div style={{ fontSize: 12, color: "#4e5d78" }}>
        <strong style={{ color: "#14284b" }}>Scudamore's Brand Portal</strong> · Working draft · v0.1
      </div>
      <div style={{ fontSize: 11, color: "#9c7a2f", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: fontStack.mono }}>
        Punting gently down the Cam since 1910
      </div>
    </div>
  );
}