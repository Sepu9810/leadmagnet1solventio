export function buildPreviewEmbedUrl(videoId: string, startSeconds = 0) {
  if (!videoId) {
    return "";
  }

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    rel: "0",
    loop: "1",
    playlist: videoId,
    start: String(startSeconds),
    modestbranding: "1",
    playsinline: "1"
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function buildWatchEmbedUrl(videoId: string, startSeconds = 0) {
  if (!videoId) {
    return "";
  }

  const params = new URLSearchParams({
    start: String(startSeconds),
    rel: "0",
    modestbranding: "1",
    playsinline: "1"
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
