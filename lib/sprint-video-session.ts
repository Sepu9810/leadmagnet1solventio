type StoredSprintVideoSession = {
  sessionId: string;
  videoId: string;
  startedAt: number;
  lastPositionSeconds: number;
  maxPositionSeconds: number;
  completed: boolean;
};

const STORAGE_KEY = "solventio_sprint_video_session_v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function getStorage() {
  if (!isBrowser()) {
    return null;
  }

  return window.sessionStorage;
}

function generateSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `svsl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readStoredSession(): StoredSprintVideoSession | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StoredSprintVideoSession;
  } catch {
    return null;
  }
}

function writeStoredSession(session: StoredSprintVideoSession) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getOrCreateSprintVideoSession(videoId: string) {
  const existing = readStoredSession();

  if (existing && existing.videoId === videoId) {
    return existing;
  }

  const nextSession: StoredSprintVideoSession = {
    sessionId: generateSessionId(),
    videoId,
    startedAt: Date.now(),
    lastPositionSeconds: 0,
    maxPositionSeconds: 0,
    completed: false
  };

  writeStoredSession(nextSession);
  return nextSession;
}

export function updateStoredSprintVideoSession(
  patch: Partial<StoredSprintVideoSession> & Pick<StoredSprintVideoSession, "videoId">
) {
  const base = getOrCreateSprintVideoSession(patch.videoId);
  const nextSession: StoredSprintVideoSession = {
    ...base,
    ...patch
  };

  writeStoredSession(nextSession);
  return nextSession;
}

export function getStoredSprintVideoSessionSummary(videoId?: string) {
  const session = readStoredSession();
  if (!session) {
    return {};
  }

  if (videoId && session.videoId !== videoId) {
    return {};
  }

  return {
    video_session_id: session.sessionId,
    video_last_position_seconds: session.lastPositionSeconds,
    video_max_position_seconds: session.maxPositionSeconds,
    video_completed: session.completed
  };
}
