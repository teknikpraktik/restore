// Få, standardiserade linjeikoner. Används för navigering, inte dekoration.

const Svg = ({ d, size = 24 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={d} />
  </svg>
)

export const HomeIcon = () => <Svg d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
export const CourseIcon = () => <Svg d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
export const ExerciseIcon = () => <Svg d="M12 8.5V13l2.5 1.5M9.5 2.5h5M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
export const MoreIcon = () => <Svg d="M5.5 12h.01M12 12h.01M18.5 12h.01" />
export const ChevronLeft = () => <Svg d="M14.5 6 8.5 12l6 6" />
export const ChevronRight = () => (
  <span className="row-chevron">
    <Svg d="M9.5 6l6 6-6 6" size={18} />
  </span>
)
