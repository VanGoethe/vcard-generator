# Azure AD: Single-Page Application redirect URIs (AADSTS9002326)

This app uses [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js) with the authorization code flow and PKCE. Redirect URIs **must** be registered under the **Single-page application** platform in Microsoft Entra ID (Azure AD), not under **Web**.

If redirect URIs are only registered as **Web**, token redemption fails with:

- **HTTP 400** on `POST .../oauth2/v2.0/token`
- **AADSTS9002326**: *Cross-origin token redemption is permitted only for the 'Single-Page Application' client-type*

## Fix (Azure Portal)

1. Open [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** → select your app (matches `NEXT_PUBLIC_MSAL_CLIENT_ID` in `.env`).
2. Go to **Authentication**.
3. Under **Platform configurations**:
   - If the same origins appear under **Web**, remove them from **Web** (or keep Web only if you have a separate server-side flow that needs it).
   - Click **Add a platform** → **Single-page application**.
   - Add redirect URIs (must match `NEXT_PUBLIC_DEVELOPMENT_URL` / `NEXT_PUBLIC_PRODUCTION_URL` origins exactly, no trailing slash unless you configured one):
     - `http://localhost:3000` — local dev
     - `https://ecard.immap.org` — production (adjust if your public URL differs)
4. Under **Implicit grant and hybrid flows**, you typically do **not** need to enable implicit grant for MSAL 2.x+ with auth code + PKCE.
5. **Save**.

After saving, sign out, clear site data for localhost if needed, and sign in again. `handleRedirectPromise()` should complete without AADSTS9002326.

## References

- [Microsoft identity platform: SPA redirect URIs](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-registration)
- Error code [AADSTS9002326](https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes) (cross-origin token redemption / SPA client type)
