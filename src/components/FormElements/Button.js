export function Button({ title, type = 'submit', loading, disabled, btnClass, ...props }) {
  return (
    <button disabled={disabled} className={`btn ${btnClass}`} type={type} {...props}>
      {loading && (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      )}
      {title}
    </button>
  );
}
