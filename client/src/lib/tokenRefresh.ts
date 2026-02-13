import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./axios";

// ── Configuration ──────────────────────────────────────────────────────
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://124.123.18.19:3006/api";

/**
 * How many seconds BEFORE the access token expiry should we proactively
 * refresh? We refresh at 80% of the token lifetime.
 *
 * With a 300s (5 min) access token → refresh every ~240s (4 min).
 * This ensures we always have a valid token.
 */
const REFRESH_SAFETY_MARGIN = 0.8;

/** Fallback refresh interval if we can't parse the token (4 minutes) */
const FALLBACK_REFRESH_MS = 4 * 60 * 1000;

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let isRefreshing = false;

// ── JWT helpers ────────────────────────────────────────────────────────
/**
 * Decode the payload of a JWT without any library.
 * Returns null if the token is malformed.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/**
 * Returns the number of milliseconds until the access token expires.
 * Returns null if the token can't be parsed.
 */
function getTokenExpiryMs(token: string): number | null {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== "number") return null;
    const expiresAtMs = payload.exp * 1000;
    return expiresAtMs - Date.now();
}

// ── Silent refresh ─────────────────────────────────────────────────────
/**
 * Silently refresh the access token using the stored refresh token.
 * Returns true on success, false on failure.
 */
async function silentRefresh(): Promise<boolean> {
    if (isRefreshing) return false;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        console.warn("[TokenRefresh] No refresh token available.");
        return false;
    }

    isRefreshing = true;

    try {
        const { data } = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken },
        );

        const newAccessToken = data.data?.accessToken || data.accessToken;
        const newRefreshToken =
            data.data?.refreshToken || data.refreshToken || refreshToken;

        if (!newAccessToken) {
            console.error("[TokenRefresh] No access token in refresh response.");
            return false;
        }

        setTokens(newAccessToken, newRefreshToken);
        console.info("[TokenRefresh] Token refreshed successfully.");

        // Re-schedule the next refresh based on new token's expiry
        scheduleRefresh();
        return true;
    } catch (error: any) {
        console.error("[TokenRefresh] Silent refresh failed:", error?.message);

        // If the refresh token itself is expired/invalid → force logout
        if (error?.response?.status === 401 || error?.response?.status === 400) {
            clearTokens();
            window.location.href = "/login";
        }
        return false;
    } finally {
        isRefreshing = false;
    }
}

// ── Scheduler ──────────────────────────────────────────────────────────
/**
 * Schedule the next proactive token refresh based on the current
 * access token's expiry time.
 */
export function scheduleRefresh(): void {
    // Clear any existing timer
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }

    const accessToken = getAccessToken();
    if (!accessToken) return; // Not logged in

    const expiresInMs = getTokenExpiryMs(accessToken);
    let refreshInMs: number;

    if (expiresInMs && expiresInMs > 0) {
        // Refresh at 80% of remaining lifetime
        refreshInMs = Math.max(expiresInMs * REFRESH_SAFETY_MARGIN, 10_000); // at least 10s
    } else if (expiresInMs !== null && expiresInMs <= 0) {
        // Token already expired – refresh immediately
        refreshInMs = 0;
    } else {
        // Can't parse – use fallback interval
        refreshInMs = FALLBACK_REFRESH_MS;
    }

    console.info(
        `[TokenRefresh] Next refresh in ${Math.round(refreshInMs / 1000)}s`,
    );

    if (refreshInMs === 0) {
        silentRefresh();
    } else {
        refreshTimer = setTimeout(() => {
            silentRefresh();
        }, refreshInMs);
    }
}

/**
 * Stop the proactive refresh timer (e.g. on logout).
 */
export function stopRefresh(): void {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
}

// ── Visibility listener ────────────────────────────────────────────────
/**
 * When the browser tab becomes visible again (e.g. after laptop wake-up),
 * check if the token is about to expire and refresh if needed.
 */
function handleVisibilityChange(): void {
    if (document.visibilityState !== "visible") return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    const expiresInMs = getTokenExpiryMs(accessToken);

    // If expired or expiring in less than 60 seconds → immediate refresh
    if (expiresInMs === null || expiresInMs < 60_000) {
        console.info("[TokenRefresh] Tab focused – triggering refresh.");
        silentRefresh();
    } else {
        // Re-schedule normally
        scheduleRefresh();
    }
}

// ── Initialiser ────────────────────────────────────────────────────────
let isInitialised = false;

/**
 * Initialise the proactive token refresh system.
 * Call this once after login or on app mount when the user is authenticated.
 */
export function initTokenRefresh(): void {
    if (isInitialised) return;
    isInitialised = true;

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start the first refresh schedule
    scheduleRefresh();
}

/**
 * Tear down the token refresh system (e.g. on logout).
 */
export function destroyTokenRefresh(): void {
    stopRefresh();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    isInitialised = false;
}
