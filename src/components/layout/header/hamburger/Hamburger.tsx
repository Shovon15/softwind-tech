"use client";

type Props = {
  isOpen: boolean;
  className?: string;
};

export default function Hamburger({ isOpen, className = "" }: Props) {
  return (
    <svg
      className={`menuIcon menuIcon--rotate menuIcon--v8 ${
        isOpen ? "is-open" : "is-closed"
      } ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(50 50) scale(1.55) translate(-50 -50)">
        <path
          className="menuIcon__line menuIcon__line--top"
          d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
        />
        <path
          className="menuIcon__line menuIcon__line--middle"
          d="m 30,50 h 40"
        />
        <path
          className="menuIcon__line menuIcon__line--bottom"
          d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
        />
      </g>
    </svg>
  );
}
