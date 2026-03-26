import { type ReactNode } from "react";

/* ──────────────── Code Block ──────────────── */
interface CodeBlockProps {
  code: string;
  label?: string;
  highlight?: string;
}
export function CodeBlock({ code, label, highlight }: CodeBlockProps) {
  return (
    <div
      style={{
        background: "#0d0d18",
        border: "1px solid rgba(124,106,245,0.25)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {label && (
        <div
          style={{
            padding: "8px 16px",
            borderBottom: "1px solid rgba(124,106,245,0.15)",
            fontSize: 12,
            color: "#7c6af5",
            fontFamily: "var(--mono)",
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      )}
      <pre
        style={{
          padding: "20px 24px",
          margin: 0,
          fontSize: 13,
          lineHeight: 1.7,
          color: "#c9c0f0",
          overflowX: "auto",
          fontFamily: "var(--mono)",
        }}
        dangerouslySetInnerHTML={{
          __html: highlight
            ? code.replace(
                new RegExp(`(${highlight})`, "g"),
                `<mark style="background:rgba(124,106,245,0.3);color:#a992ff;border-radius:3px;padding:1px 3px">$1</mark>`
              )
            : code,
        }}
      />
    </div>
  );
}

/* ──────────────── Section Header ──────────────── */
interface SectionHeaderProps {
  number: string;
  topic: string;
  title: string;
  subtitle?: string;
  color?: string;
}
export function SectionHeader({
  number,
  topic,
  title,
  subtitle,
  color = "#7c6af5",
}: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 14px",
          background: `${color}22`,
          border: `1px solid ${color}44`,
          borderRadius: 100,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color,
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          TOPIC {number}
        </span>
        <span
          style={{
            width: 1,
            height: 12,
            background: `${color}44`,
          }}
        />
        <span
          style={{
            fontSize: 11,
            color,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {topic}
        </span>
      </div>
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "var(--text)",
          marginBottom: 14,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 18,
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: 620,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ──────────────── Status Badge ──────────────── */
export function StatusBadge({
  status,
}: {
  status: "loading" | "success" | "error" | "idle";
}) {
  const colors = {
    loading: { bg: "#f59e0b22", border: "#f59e0b44", text: "#f59e0b" },
    success: { bg: "#22c55e22", border: "#22c55e44", text: "#22c55e" },
    error: { bg: "#f43f5e22", border: "#f43f5e44", text: "#f43f5e" },
    idle: { bg: "#ffffff11", border: "#ffffff22", text: "#888096" },
  };
  const c = colors[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 100,
        fontSize: 12,
        color: c.text,
        fontWeight: 600,
        fontFamily: "var(--mono)",
        letterSpacing: "0.04em",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c.text,
          opacity: status === "loading" ? 0.7 : 1,
          animation: status === "loading" ? "pulse 1s ease-in-out infinite" : undefined,
        }}
      />
      {status.toUpperCase()}
      <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
    </span>
  );
}

/* ──────────────── Compare Panel ──────────────── */
interface ComparePanelProps {
  before: { label: string; code: string };
  after: { label: string; code: string };
  highlight?: string;
}
export function ComparePanel({ before, after, highlight }: ComparePanelProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#f43f5e",
            }}
          />
          <span
            style={{ fontSize: 13, color: "#888096", fontWeight: 600 }}
          >
            {before.label}
          </span>
        </div>
        <CodeBlock code={before.code} />
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span
            style={{ fontSize: 13, color: "#888096", fontWeight: 600 }}
          >
            {after.label}
          </span>
        </div>
        <CodeBlock code={after.code} highlight={highlight} />
      </div>
    </div>
  );
}

/* ──────────────── Info Card ──────────────── */
export function InfoCard({
  title,
  children,
  color = "#7c6af5",
  icon,
}: {
  title: string;
  children: ReactNode;
  color?: string;
  icon?: string;
}) {
  return (
    <div
      style={{
        padding: 24,
        background: "#12121a",
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        {title}
      </div>
      <div style={{ fontSize: 14, color: "#888096", lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

/* ──────────────── Nav Button ──────────────── */
export function NavButton({
  to,
  label,
  direction = "next",
  color = "#7c6af5",
}: {
  to: string;
  label: string;
  direction?: "next" | "prev";
  color?: string;
}) {
  return (
    <a
      className={direction === "prev" ? "ui-outline-btn" : undefined}
      href={to}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 24px",
        background: direction === "next" ? color : "transparent",
        color: direction === "next" ? "#fff" : "#888096",
        border: `1px solid ${direction === "next" ? color : "#ffffff22"}`,
        borderRadius: 10,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "var(--sans)",
        cursor: "pointer",
        transition: "opacity 0.15s, transform 180ms ease, background-color 180ms ease, border-color 180ms ease",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.opacity = "0.8")
      }
      onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {direction === "prev" && "←"} {label}{" "}
      {direction === "next" && "→"}
    </a>
  );
}
