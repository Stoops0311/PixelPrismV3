import * as React from "react"

function DS2Section({
  id,
  label,
  title,
  subtitle,
  children,
}: {
  id: string
  label: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="space-y-8">
      <div>
        <p className="sb-label" style={{ color: "#e8956a", marginBottom: 8 }}>
          {label}
        </p>
        <h2 className="sb-h2" style={{ color: "#eaeef1" }}>
          {title}
        </h2>
        {subtitle && (
          <p
            className="sb-body"
            style={{ color: "#6d8d9f", marginTop: 8 }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

export { DS2Section }
