import { useState } from "react";

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

// SHA-256 of the admin password, so the password itself isn't in the code
const ADMIN_PASSWORD_HASH =
  "f2571781caca06af36e8bb3eff6336dab46ed88a3ed9120605a21b6b3f90b274";

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function Locked({ unlockDate, onUnlock }) {
  const [password, setPassword] = useState("");
  const [failedTries, setFailedTries] = useState(0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil((unlockDate - new Date()) / msPerDay);

  async function handleSubmit(event) {
    event.preventDefault();

    if ((await sha256(password)) === ADMIN_PASSWORD_HASH) {
      onUnlock();
    } else {
      setPassword("");
      setFailedTries(failedTries + 1);
    }
  }

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

      {/* Security office terminal for the admin override */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <p className="terminal-title">Security Override // Staff Only</p>
        <label htmlFor="admin-code">&gt; Enter Code</label>
        <input
          id="admin-code"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" disabled={password === ""}>
          Override
        </button>
      </form>

      {/* Key changes on every wrong try so the glitch replays */}
      {failedTries > 0 && (
        <p key={failedTries} className="error glitch">
          Invalid code. Intruder logged. ({failedTries})
        </p>
      )}
    </div>
  );
}

export default Locked;
