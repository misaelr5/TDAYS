"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useAnimate,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { motionTokens } from "@/config/motion";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: motionTokens.duration, ease: motionTokens.ease }}
    >
      {children}
    </MotionConfig>
  );
}

// Content is rendered visibly on the server. Effects only enhance a functioning page.
export function RevealText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const [scope, animate] = useAnimate();
  const visible = useInView(scope, { once: true, margin: "0px 0px -30px 0px" });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!visible || reduced) return;
    const controls = animate(
      ".word-inner",
      { y: ["108%", "0%"] },
      {
        duration: motionTokens.duration,
        ease: motionTokens.ease,
        delay: (i) => i * motionTokens.stagger,
      },
    );
    return () => controls.stop();
  }, [visible, reduced, animate]);
  return (
    <span ref={scope} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {children.split(" ").map((word, i) => (
          <span className="word-mask" key={`${word}-${i}`}>
            <span className="word-inner">{word}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function Parallax({
  children,
  className = "",
  distance = 60,
  rotation = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  rotation?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-rotation, rotation]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { y, rotate }}
    >
      {children}
    </motion.div>
  );
}
