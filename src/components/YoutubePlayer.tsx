const VIDEO_ID = '28KRPhVzCus';

interface YoutubePlayerProps {
  videoId?: string;
}

export default function YoutubePlayer({ videoId = VIDEO_ID }: YoutubePlayerProps) {
  return (
    <div className="w-full max-w-md px-6 mb-10">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-lg"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Focus music"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
