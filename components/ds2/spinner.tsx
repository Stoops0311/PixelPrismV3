function DS2Spinner() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="sb-dot" />
      <span className="sb-dot" style={{ animationDelay: "-0.16s" }} />
      <span className="sb-dot" style={{ animationDelay: "0s" }} />
    </div>
  )
}

export { DS2Spinner }
