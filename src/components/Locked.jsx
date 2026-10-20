// Pixel art padlock on a 12x14 grid: shackle, body, then the keyhole cut out
const LOCK_PIXELS =
  "M3 0h6v1H3z M2 1h2v5H2z M8 1h2v5H8z " +
  "M0 6h12v8H0z M5 8h2v2H5z M5.5 10h1v2h-1z";

// Padlock drawn with the current text colour
export function LockIcon({ size = 20 }) {
  return (
    <svg
      className="lock-icon"
      width={(size * 12) / 14}
      height={size}
      viewBox="0 0 12 14"
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={LOCK_PIXELS} fillRule="evenodd" />
    </svg>
  );
}

function Locked({ unlockDate }) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((unlockDate - new Date()) / msPerDay);

  return (
    <div className="card cam-2 locked">
      <LockIcon size={70} />
      <h2 className="denied">Access Denied</h2>
      <p>
        Pulling questions unlocks on{" "}
        {unlockDate.toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        .
      </p>
      <p className="message">
        {daysLeft} {daysLeft === 1 ? "day" : "days"} to go
      </p>
    </div>
  );
}

export default Locked;
