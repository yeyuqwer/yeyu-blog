"use client";

// TODO: wait to pr
import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils/common/shadcn";

export interface PaletteIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PaletteIconProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  size?: number;
}

const paletteVariants: Variants = {
  normal: {
    rotate: 0,
    scale: 1,
  },
  animate: {
    rotate: [0, -6, 6, 0],
    scale: [1, 1.04, 1],
    transition: {
      duration: 0.65,
      ease: "easeInOut",
    },
  },
};

const swatchVariants: Variants = {
  normal: {
    opacity: 1,
    scale: 1,
  },
  animate: (i: number) => ({
    opacity: [0.35, 1],
    scale: [0.5, 1.25, 1],
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

const PaletteIcon = forwardRef<PaletteIconHandle, PaletteIconProps>(
  ({ onMouseEnter, onMouseLeave, className, isActive = false, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useEffect(() => {
      controls.start(isActive ? "animate" : "normal");
    }, [controls, isActive]);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else if (isActive) {
          controls.start("animate");
        } else {
          controls.start("normal");
        }
      },
      [controls, isActive, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.g
            animate={controls}
            initial="normal"
            style={{ transformOrigin: "12px 12px" }}
            variants={paletteVariants}
          >
            <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
            {[
              { cx: "13.5", cy: "6.5" },
              { cx: "17.5", cy: "10.5" },
              { cx: "6.5", cy: "12.5" },
              { cx: "8.5", cy: "7.5" },
            ].map(({ cx, cy }, index) => (
              <motion.circle
                animate={controls}
                custom={index + 1}
                cx={cx}
                cy={cy}
                fill="currentColor"
                initial="normal"
                key={`${cx}-${cy}`}
                r=".5"
                variants={swatchVariants}
              />
            ))}
          </motion.g>
        </svg>
      </div>
    );
  }
);

PaletteIcon.displayName = "PaletteIcon";

export { PaletteIcon };
