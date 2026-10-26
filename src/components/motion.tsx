"use client";

import { useEffect, type ReactNode } from "react";
import {
  MotionConfig,
  useAnimate,
  useInView,
  useReducedMotion,
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
