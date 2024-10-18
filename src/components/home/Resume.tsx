"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import logo from "@/assets/images/logo.png";
import { User, ShoppingCart, Users } from "lucide-react";


const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
          className,
        )}
      >
        {children}
      </div>
    );
  }
);

Circle.displayName = "Circle";

export default function Resume() {
  const containerRef = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null); // Ref pour Productor
  const div4Ref = useRef<HTMLDivElement>(null); // Ref pour le logo
  const div6Ref = useRef<HTMLDivElement>(null); // Ref pour Collector
  const div7Ref = useRef<HTMLDivElement>(null); // Ref pour Consumer

  return (
    <div
      className="relative md:h-[600px] flex  max-w-md w-full items-center justify-center overflow-hidden   p-10  "
      ref={containerRef}
    >

      <div className="flex size-full flex-col max-w-lg max-h-[200px] items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">

          <div className="flex flex-col items-center">
            <Circle ref={div2Ref} className="size-12">
              <User className="text-green-500 dark:text-green-400" />
            </Circle>
            <span>Productor</span>
          </div>

          <Circle ref={div4Ref} className="size-16">
            <img alt="Logo" src={logo} />
          </Circle>

          <div className="flex flex-col items-center">
            <Circle ref={div6Ref} className="size-12">
              <ShoppingCart className="text-green-500 dark:text-green-400"  />
            </Circle>
            <span>Collector</span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center">
            <Circle ref={div7Ref} className="size-12">
              <Users className="text-green-500 dark:text-green-400" />
            </Circle>
            <span>Consumer</span>
          </div>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
      <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
    </div>
  );
}
