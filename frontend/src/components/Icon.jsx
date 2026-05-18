const iconShapes = {
  addCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  arrowLeft: <path d="M19 12H5m0 0 5-5m-5 5 5 5" />,
  arrowRight: <path d="M5 12h14m0 0-5-5m5 5-5 5" />,
  cash: (
    <>
      <path d="M4 8h16v10H4z" />
      <circle cx="12" cy="13" r="2.5" />
      <path d="M7 10h.01M17 16h.01" />
    </>
  ),
  chart: <path d="M5 19V9M12 19V5M19 19v-8M4 19h16" />,
  bag: (
    <>
      <path d="M7 8h10l1.5 11h-13z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </>
  ),
  bagCheck: (
    <>
      <path d="M7 8h10l1.5 11h-13z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
      <path d="m9.5 14 1.8 1.8 3.4-3.6" />
    </>
  ),
  basket: (
    <>
      <path d="M5 10h14l-1.5 8h-11z" />
      <path d="m9 10 3-4 3 4" />
      <path d="M8 13h8M9 16h6" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4.5v9L12 21 4 16.5v-9z" />
      <path d="m12 3 8 4.5-8 4.5L4 7.5 12 3Zm0 9v9" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </>
  ),
  checkFilled: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" stroke="none" />
      <path d="m8.5 12 2.2 2.2 4.8-5" stroke="white" />
    </>
  ),
  circle: <circle cx="12" cy="12" r="7" />,
  collection: (
    <>
      <path d="M6 6h10v10H6z" />
      <path d="M9 3h10v10M3 9h10v10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
      <path d="M8 4.5A9 9 0 0 1 18 5" />
    </>
  ),
  close: <path d="m7 7 10 10M17 7 7 17" />,
  cup: (
    <>
      <path d="M8 6h8l-1 12H9z" />
      <path d="m13 6 2-2" />
      <path d="M7 10h10" />
    </>
  ),
  cupHot: (
    <>
      <path d="M7 10h9v5a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4z" />
      <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
      <path d="M9 5c1 1 1 2 0 3M12 4c1 1 1 2 0 3" />
    </>
  ),
  grid: (
    <>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </>
  ),
  grid3: (
    <>
      <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
    </>
  ),
  gift: (
    <>
      <path d="M5 10h14v10H5z" />
      <path d="M12 10v10M5 14h14M12 10c-3 0-4.5-1.2-4.5-2.8S8.5 4 10.5 4c1.2 0 1.9.8 1.5 2.5-.4 1.7-1.1 2.8 0 3.5Zm0 0c3 0 4.5-1.2 4.5-2.8S15.5 4 13.5 4c-1.2 0-1.9.8-1.5 2.5.4 1.7 1.1 2.8 0 3.5Z" />
    </>
  ),
  hexagon: <path d="m7 5 10 0 5 7-5 7H7l-5-7z" />,
  lightning: <path d="M13 2 6 13h5l-1 9 8-12h-5z" />,
  logout: (
    <>
      <path d="M10 5H6v14h4" />
      <path d="M13 8l5 4-5 4M18 12h-9" />
    </>
  ),
  lockUser: (
    <>
      <path d="M8 20v-1.5A3.5 3.5 0 0 1 11.5 15h1A3.5 3.5 0 0 1 16 18.5V20" />
      <circle cx="12" cy="8" r="3" />
      <path d="M18 11.5h2a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1h.5v-1a1.5 1.5 0 0 1 3 0v1Z" />
    </>
  ),
  nodes: (
    <>
      <circle cx="6" cy="8" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="8" cy="18" r="2" />
      <path d="M8 8h8M8 18h8M6 10v6M18 8v8" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="16" cy="10" r="2" />
      <path d="M4.5 19a4.5 4.5 0 0 1 9 0M13.5 19a3.5 3.5 0 0 1 6 0" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M6.5 20a5.5 5.5 0 0 1 11 0" />
    </>
  ),
  personCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M8 18a4 4 0 0 1 8 0" />
    </>
  ),
  receipt: (
    <>
      <path d="M7 4h10v16l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5z" />
      <path d="M9.5 9h5M9.5 12h5M9.5 15h3.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="5" />
      <path d="m15 15 5 5" />
    </>
  ),
  star: <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />,
  shop: (
    <>
      <path d="M5 10h14v10H5z" />
      <path d="M4 10 6 5h12l2 5" />
      <path d="M9 20v-5h6v5" />
    </>
  ),
  sliders: (
    <>
      <path d="M5 7h14M5 12h14M5 17h14" />
      <circle cx="9" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="11" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  terminal: (
    <>
      <path d="M4 6h16v10H4z" />
      <path d="m7 10 2 2-2 2M11 14h4" />
    </>
  ),
  square: <path d="M6 6h12v12H6z" />,
  squareCircle: (
    <>
      <path d="M5 5h8v8H5z" />
      <circle cx="16.5" cy="16.5" r="3.5" />
    </>
  ),
  storeBag: (
    <>
      <path d="M7 8h10l1.5 11h-13z" />
      <path d="M8 8 10 4h4l2 4" />
    </>
  ),
  trash: (
    <>
      <path d="M7 7h10M9 7V5h6v2M8 7l1 12h6l1-12" />
      <path d="M10 10v6M14 10v6" />
    </>
  ),
  triangle: <path d="m12 5 8 14H4z" />,
  warning: (
    <>
      <path d="m12 4 9 16H3z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
};

const iconAliases = {
  inbox: 'box',
  'box-seam': 'box',
  'cash-stack': 'cash',
  'check2-circle': 'checkCircle',
  'cup-hot': 'cupHot',
  'exclamation-triangle': 'warning',
};

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8, filled = false }) {
  const resolvedName = iconShapes[name] ? name : iconAliases[name];
  const shape = iconShapes[resolvedName];

  if (!shape) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}
