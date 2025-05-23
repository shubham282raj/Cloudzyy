import { useAppContext } from "../Context/AppContext";
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
  const { loaderTxt } = useAppContext();

  return (
    <>
      <div className="container mx-auto"></div>
      {showText && <div className="mx-auto my-3 text-[9px]">{loaderTxt}</div>}
    </>
  );
};

export const ScreenLoader = () => {
  return (
    <div className="fixed left-1/2 top-0 z-10 flex h-screen w-full -translate-x-1/2 items-center justify-center bg-black bg-opacity-20 backdrop-blur-3xl">
      <div className="scale-[1.8]">
        <CircularLoader2 showText={true} />
      </div>
    </div>
  );
};
