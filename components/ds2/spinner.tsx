function DS2Spinner({ size }: { size?: "sm" | "md" | "lg" } = {}) {
  const scale = size === "lg" ? "scale-150" : size === "sm" ? "scale-75" : ""
  return (
    <div className={`flex items-center gap-1.5 ${scale}`} role="status" aria-label="Loading">
      <span className="sb-dot" />
      <span className="sb-dot" style={{ animationDelay: "-0.16s" }} />
      <span className="sb-dot" style={{ animationDelay: "0s" }} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { DS2Spinner }
