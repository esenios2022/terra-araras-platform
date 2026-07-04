export default function AudioPlayer({
  contentId,
  driveUrl,
}: {
  contentId: string;
  driveUrl?: string | null;
}) {
  if (driveUrl) {
    return (
      <iframe
        src={driveUrl}
        width="100%"
        height="150"
        allow="autoplay"
        className="w-full rounded-xl border-0"
        title="Audio"
      />
    );
  }

  return (
    <audio
      controls
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      className="w-full"
      src={`/api/media/audio?contentId=${contentId}`}
    />
  );
}
