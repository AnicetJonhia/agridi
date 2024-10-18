import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import Marquee from "@/components/ui/marquee.tsx";
import { Tractor, Target, Leaf, Users, Globe2, Handshake } from "lucide-react";

const reviews = [
  {
    title: "Revolutionizing Agricultural Trade",
    subtitle: "Producers, Collectors, Consumers",
    description: "AgriD connects producers, collectors, and consumers directly for a shorter and more efficient supply chain.",
    icon: <Tractor className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Our Mission",
    subtitle: "Simplifying Agricultural Transactions",
    description: "AgriD aims to make agricultural transactions simple, fair, and transparent for all participants.",
    icon: <Target className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "A Platform for Everyone",
    subtitle: "Producers, Collectors, Consumers",
    description: "AgriD offers an intuitive interface to create profiles, manage listings, and facilitate orders and payments.",
    icon: <Users className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Benefits for Stakeholders",
    subtitle: "Producers, Collectors, Consumers",
    description: "AgriD enhances producer income, improves collector management, and gives consumers access to local products at fair prices.",
    icon: <Handshake className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Commitment to Sustainability",
    subtitle: "Environmentally Friendly Practices",
    description: "AgriD promotes sustainable agriculture by reducing food waste and supporting environmentally friendly practices.",
    icon: <Leaf className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Join the AgriD Movement!",
    subtitle: "Towards a Fairer Food Future",
    description: "AgriD strives to transform the global food system towards a fairer and more sustainable future.",
    icon: <Globe2 className="text-green-500 dark:text-green-400" />,
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  icon,
  title,
  subtitle,
  description,
}: {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  description: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <figure
      className={cn(
        "relative w-64 h-40 flex flex-col justify-center items-center cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="text-primary-600 dark:text-primary-400">{icon}</div>
        <div className="flex flex-col text-center">
          {!isHovered ? (
            <>
              <figcaption className="text-sm text-start font-medium title-color dark:text-white">
                {title}
              </figcaption>
              <p className="text-xs text-start font-medium dark:text-white/40">{subtitle}</p>
            </>
          ) : (
            <blockquote className="text-start mt-2 text-sm dark:text-white">{description}</blockquote>
          )}
        </div>
      </div>
    </figure>
  );
};

const Description: React.FC = () => {
  return (
    <div id="descriptionSection" className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden">
      {/* Titre ajouté ici */}
      <h2 className="text-2xl  font-bold text-gray-800 dark:text-white mb-4">Discover AgriD's Impact</h2>

      <div className="flex w-full h-40 items-left justify-center">
        <Marquee pauseOnHover className="[--duration:20s] h-40">
          {firstRow.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </Marquee>
      </div>
      <div className="flex w-full h-40 items-center justify-center">
        <Marquee reverse pauseOnHover className="[--duration:20s] h-40">
          {secondRow.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default Description;
