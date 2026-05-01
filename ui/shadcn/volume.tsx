"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils/common/shadcn";

export interface VolumeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface VolumeIconProps extends HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  size?: number;
}

const speakerVariants: Variants = {
  normal: {
    x: 0,
  },
  animate: {
    x: [0, -1, 1, 0],
    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
};

const waveVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
  },
  animate: (i: number) => ({
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      delay: i * 0.1,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

const VolumeIcon = forwardRef<VolumeIconHandle, VolumeIconProps>(
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
          <motion.path
            animate={controls}
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
            initial="normal"
            variants={speakerVariants}
          />
          {[
            "M16 9a5 5 0 0 1 0 6",
            "M19.364 18.364a9 9 0 0 0 0-12.728",
          ].map((d, index) => (
            <motion.path
              animate={controls}
              custom={index + 1}
              d={d}
              initial="normal"
              key={d}
              variants={waveVariants}
            />
          ))}
        </svg>
      </div>
    );
  }
);

VolumeIcon.displayName = "VolumeIcon";

export { VolumeIcon };
