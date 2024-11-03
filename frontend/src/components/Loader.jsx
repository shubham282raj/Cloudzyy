import "./Loader.css";

export const TriangularLoader = () => {
  return (
    <div className="loader triangle">
      <svg viewBox="0 0 86 80">
        <polygon points="43 8 79 72 7 72"></polygon>
      </svg>
    </div>
  );
};
export const CircularLoader = () => {
  return (
    <div className="loader">
      <svg viewBox="0 0 80 80">
        <circle r="32" cy="40" cx="40" id="test"></circle>
      </svg>
    </div>
  );
};
export const SquareLoader = () => {
  return (
    <div className="loader">
      <svg viewBox="0 0 80 80">
        <rect height="64" width="64" y="8" x="8"></rect>
      </svg>
    </div>
  );
};

export const CircularLoader2 = ({ showText = false }) => {
  return (
    <>
      <div class="container mx-auto"></div>
      {showText && (
        <div id="circularLoader2" className="mx-auto my-3 text-[9px]"></div>
      )}
    </>
  );
};

export const ScreenLoader = () => {
  return (
    <div className="absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-20">
      <div className="scale-[1.8]">
        <CircularLoader2 showText={true} />
      </div>
    </div>
  );
};
