import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const eventTypeValidator = v.union(
  v.literal("session_start"),
  v.literal("play"),
  v.literal("pause"),
  v.literal("heartbeat"),
  v.literal("seek"),
  v.literal("milestone"),
  v.literal("complete")
);

function sanitizeNonNegativeNumber(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return Math.round(value * 100) / 100;
}

function mergeOptionalString(
  currentValue: string | undefined,
  nextValue: string | undefined
) {
  return currentValue ?? nextValue;
}

export const trackEvent = mutation({
  args: {
    sessionId: v.string(),
    videoId: v.string(),
    eventType: eventTypeValidator,
    startedAt: v.optional(v.number()),
    currentPositionSeconds: v.optional(v.number()),
    maxPositionSeconds: v.optional(v.number()),
    watchIncrementSeconds: v.optional(v.number()),
    milestonePercent: v.optional(v.number()),
    landing_path: v.optional(v.string()),
    landing_url: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utm_source: v.optional(v.string()),
    utm_medium: v.optional(v.string()),
    utm_campaign: v.optional(v.string()),
    utm_content: v.optional(v.string()),
    utm_term: v.optional(v.string()),
    utm_id: v.optional(v.string()),
    fbclid: v.optional(v.string()),
    gclid: v.optional(v.string()),
    campaign_id: v.optional(v.string()),
    adset_id: v.optional(v.string()),
    ad_id: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("sprint_video_sessions")
      .withIndex("by_session_id", (q) => q.eq("session_id", args.sessionId))
      .first();

    const currentPositionSeconds = sanitizeNonNegativeNumber(args.currentPositionSeconds) ?? 0;
    const maxPositionSecondsInput =
      sanitizeNonNegativeNumber(args.maxPositionSeconds) ?? currentPositionSeconds;
    const watchIncrementSeconds = sanitizeNonNegativeNumber(args.watchIncrementSeconds) ?? 0;
    const milestonePercent = sanitizeNonNegativeNumber(args.milestonePercent);

    if (!existing) {
      const milestones =
        args.eventType === "milestone" && milestonePercent !== undefined
          ? [milestonePercent]
          : [];
      const pausePoints =
        args.eventType === "pause" && currentPositionSeconds > 0
          ? [currentPositionSeconds]
          : [];
      const seekPoints =
        args.eventType === "seek" && currentPositionSeconds > 0
          ? [currentPositionSeconds]
          : [];

      await ctx.db.insert("sprint_video_sessions", {
        session_id: args.sessionId,
        video_id: args.videoId,
        started_at: args.startedAt ?? now,
        first_play_at:
          args.eventType === "play" || args.eventType === "session_start" ? now : undefined,
        last_event_at: now,
        last_position_seconds: currentPositionSeconds,
        max_position_seconds: maxPositionSecondsInput,
        total_watch_seconds: watchIncrementSeconds,
        play_count: args.eventType === "play" ? 1 : 0,
        pause_count: args.eventType === "pause" ? 1 : 0,
        seek_count: args.eventType === "seek" ? 1 : 0,
        pause_points_seconds: pausePoints,
        seek_points_seconds: seekPoints,
        completed: args.eventType === "complete",
        completed_at: args.eventType === "complete" ? now : undefined,
        milestones_hit: milestones,
        landing_path: args.landing_path,
        landing_url: args.landing_url,
        referrer: args.referrer,
        utm_source: args.utm_source,
        utm_medium: args.utm_medium,
        utm_campaign: args.utm_campaign,
        utm_content: args.utm_content,
        utm_term: args.utm_term,
        utm_id: args.utm_id,
        fbclid: args.fbclid,
        gclid: args.gclid,
        campaign_id: args.campaign_id,
        adset_id: args.adset_id,
        ad_id: args.ad_id
      });
      return;
    }

    const nextMilestones = [...existing.milestones_hit];
    const nextPausePoints = [...existing.pause_points_seconds];
    const nextSeekPoints = [...existing.seek_points_seconds];
    if (
      args.eventType === "milestone" &&
      milestonePercent !== undefined &&
      !nextMilestones.includes(milestonePercent)
    ) {
      nextMilestones.push(milestonePercent);
      nextMilestones.sort((a, b) => a - b);
    }

    if (
      args.eventType === "pause" &&
      currentPositionSeconds > 0 &&
      nextPausePoints[nextPausePoints.length - 1] !== currentPositionSeconds
    ) {
      nextPausePoints.push(currentPositionSeconds);
    }

    if (
      args.eventType === "seek" &&
      currentPositionSeconds > 0 &&
      nextSeekPoints[nextSeekPoints.length - 1] !== currentPositionSeconds
    ) {
      nextSeekPoints.push(currentPositionSeconds);
    }

    await ctx.db.patch(existing._id, {
      last_event_at: now,
      last_position_seconds: currentPositionSeconds,
      max_position_seconds: Math.max(existing.max_position_seconds, maxPositionSecondsInput),
      total_watch_seconds: existing.total_watch_seconds + watchIncrementSeconds,
      play_count: existing.play_count + (args.eventType === "play" ? 1 : 0),
      pause_count: existing.pause_count + (args.eventType === "pause" ? 1 : 0),
      seek_count: existing.seek_count + (args.eventType === "seek" ? 1 : 0),
      pause_points_seconds: nextPausePoints,
      seek_points_seconds: nextSeekPoints,
      completed: existing.completed || args.eventType === "complete",
      completed_at:
        existing.completed_at ?? (args.eventType === "complete" ? now : undefined),
      first_play_at:
        existing.first_play_at ??
        (args.eventType === "play" || args.eventType === "session_start" ? now : undefined),
      milestones_hit: nextMilestones,
      landing_path: mergeOptionalString(existing.landing_path, args.landing_path),
      landing_url: mergeOptionalString(existing.landing_url, args.landing_url),
      referrer: mergeOptionalString(existing.referrer, args.referrer),
      utm_source: mergeOptionalString(existing.utm_source, args.utm_source),
      utm_medium: mergeOptionalString(existing.utm_medium, args.utm_medium),
      utm_campaign: mergeOptionalString(existing.utm_campaign, args.utm_campaign),
      utm_content: mergeOptionalString(existing.utm_content, args.utm_content),
      utm_term: mergeOptionalString(existing.utm_term, args.utm_term),
      utm_id: mergeOptionalString(existing.utm_id, args.utm_id),
      fbclid: mergeOptionalString(existing.fbclid, args.fbclid),
      gclid: mergeOptionalString(existing.gclid, args.gclid),
      campaign_id: mergeOptionalString(existing.campaign_id, args.campaign_id),
      adset_id: mergeOptionalString(existing.adset_id, args.adset_id),
      ad_id: mergeOptionalString(existing.ad_id, args.ad_id)
    });
  }
});

export const summarizeByVideo = query({
  args: {
    videoId: v.string()
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sprint_video_sessions")
      .withIndex("by_video_id", (q) => q.eq("video_id", args.videoId))
      .collect();

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((session) => session.completed).length;
    const avgWatchSeconds =
      totalSessions === 0
        ? 0
        : sessions.reduce((sum, session) => sum + session.total_watch_seconds, 0) /
          totalSessions;
    const avgMaxPositionSeconds =
      totalSessions === 0
        ? 0
        : sessions.reduce((sum, session) => sum + session.max_position_seconds, 0) /
          totalSessions;

    const milestoneCounts = [25, 50, 75, 95].map((milestone) => ({
      milestone,
      sessions: sessions.filter((session) => session.milestones_hit.includes(milestone)).length
    }));

    return {
      totalSessions,
      completedSessions,
      completionRate: totalSessions === 0 ? 0 : completedSessions / totalSessions,
      avgWatchSeconds,
      avgMaxPositionSeconds,
      milestoneCounts
    };
  }
});
