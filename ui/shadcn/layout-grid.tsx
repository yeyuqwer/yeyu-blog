"use client";

import { motion, useAnimation, type Variants } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils/common/shadcn";

export interface LayoutGridIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LayoutGridIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const rectTransition = {
  duration: 0.8,
  ease: "easeInOut" as const,
  times: [0, 0.4, 0.6, 1],
};

const rectResetTransition = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10,
} as const;

function createRectVariants(axis: "X" | "Y", distance: number): Variants {
  const rest = `translate${axis}(0px)`;
  const moved = `translate${axis}(${distance}px)`;

  return {
    normal: { transform: rest, transition: rectResetTransition },
    animate: {
      transform: [rest, moved, moved, rest],
      transition: rectTransition,
    },
  };
}

const topLeftVariants = createRectVariants("X", 11);
const topRightVariants = createRectVariants("Y", 11);
const bottomRightVariants = createRectVariants("X", -11);
const bottomLeftVariants = createRectVariants("Y", -11);
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const LayoutGridIcon = forwardRef<LayoutGridIconHandle, LayoutGridIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);
    const startAnimation = useCallback(() => {
      if (window.matchMedia(reducedMotionQuery).matches) return;
      void controls.start("animate");
    }, [controls]);
    const stopAnimation = useCallback(() => {
      if (window.matchMedia(reducedMotionQuery).matches) {
        controls.stop();
        controls.set("normal");
        return;
      }
      void controls.start("normal");
    }, [controls]);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation,
        stopAnimation,
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          startAnimation();
        }
      },
      [onMouseEnter, startAnimation]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          stopAnimation();
        }
      },
      [onMouseLeave, stopAnimation]
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
          <motion.rect
            animate={controls}
            height="7"
            initial="normal"
            rx="1"
            variants={topLeftVariants}
            width="7"
            x="3"
            y="3"
          />
          <motion.rect
            animate={controls}
            height="7"
            initial="normal"
            rx="1"
            variants={topRightVariants}
            width="7"
            x="14"
            y="3"
          />
          <motion.rect
            animate={controls}
            height="7"
            initial="normal"
            rx="1"
            variants={bottomRightVariants}
            width="7"
            x="14"
            y="14"
          />
          <motion.rect
            animate={controls}
            height="7"
            initial="normal"
            rx="1"
            variants={bottomLeftVariants}
            width="7"
            x="3"
            y="14"
          />
        </svg>
      </div>
    );
  }
);

LayoutGridIcon.displayName = "LayoutGridIcon";

export { LayoutGridIcon };
