function StatsCard({
  title,
  value,
  color,
  icon,
  subtitle,
}) {
  return (
    <div
      className="
      bg-white
      dark:bg-gray-900
      rounded-2xl
      shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      p-6
      border
      border-gray-200
      dark:text-gray-300
      dark:border-gray-600
      hover:-translate-y-1
      "
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 dark:text-white text-sm font-medium">
            {title}
          </p>

          <h2
            style={{ color }}
            className="text-4xl font-bold mt-2"
          >
            {value}
          </h2>

          <p className="text-gray-400 dark:text-gray-300 text-sm mt-2">
            {subtitle}
          </p>

        </div>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatsCard;