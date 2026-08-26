# Security headers (set at the CDN edge)

Response headers cannot be set from a static site itself; they belong in
the CDN's edge rules (infra, outside `src/`, like the deploy config).
Set these on all responses:

| Header | Value |
| --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https:` |

Notes:

- `script-src 'unsafe-inline'` is needed for the JSON-LD blocks and
  Astro's inline scripts; tighten to hashes later if wanted.
- `form-action https:` leaves room for the request-form endpoint;
  narrow it to that endpoint's origin once it exists.
- `connect-src` must include the request-form endpoint origin once it
  exists.
- HSTS only after HTTPS is confirmed working on the live domain.
- In-repo counterparts already shipped: `<meta name="referrer">`,
  `/.well-known/security.txt`, no third-party scripts anywhere.
