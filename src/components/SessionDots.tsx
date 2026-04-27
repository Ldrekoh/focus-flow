interface SessionDotsProps {
  dots: boolean[];
}

export default function SessionDots({ dots }: SessionDotsProps) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {dots.map((done, i) => (
        <div
          key={i}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-700 ${
            done ? 'bg-indigo-500 scale-125 shadow-sm' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}
