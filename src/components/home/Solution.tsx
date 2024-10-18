"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { DollarSign, CheckCircle, TrendingUp, Activity } from "lucide-react";

interface Item {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

let solutions = [
  {
    name: "Cost Reduction",
    description:
      "AgriD reduces costs by cutting out intermediaries, optimizing logistics, and aggregating demand.",

    icon: <DollarSign className="text-white" />,
    color: "#00C9A7",
  },
  {
    name: "Fair Price Guarantee",
    description:
      "The platform ensures transparent and fair pricing with just mechanisms for income distribution.",

    icon: <CheckCircle className="text-white" />,
    color: "#FFB800",
  },
  {
    name: "Resilience Strengthening",
    description:
      "AgriD diversifies markets, provides crucial information, and facilitates access to financial services.",

    icon: <TrendingUp className="text-white" />,
    color: "#FF3D71",
  },
  {
    name: "Contribution to Inflation Control",
    description:
      "The platform raises awareness about inflation impacts, encourages collaboration, and supports agricultural policies.",

    icon: <Activity className="text-white" />,
    color: "#1E86FF",
  },
];

const Notification = ({ name, description, icon, color }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",

        "transition-all duration-200 ease-in-out hover:scale-[103%]",

        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",

        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          {icon}
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export default function Solution({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[600px] max-w-md  flex-col p-6 overflow-hidden " +
          " bg-background md:shadow-xl",
        className
      )}
    >
      <h1 className="text-2xl md:mb-0  font-bold dark:text-white">Solutions</h1>
      <AnimatedList delay={4000}>
        {solutions.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
