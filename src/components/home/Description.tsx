import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import Marquee from "@/components/ui/marquee.tsx";
import { Tractor, Target, Leaf, Users, Globe2, Handshake } from "lucide-react";



const reviews = [
  {
    title: "Révolutionner le commerce agricole",
    subtitle: "Producteurs, Collecteurs, Consommateurs",
    description: "AgriD connecte directement producteurs, collecteurs et consommateurs pour une chaîne d'approvisionnement plus courte et efficace.",
    icon: <Tractor className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Notre mission",
    subtitle: "Simplifier les transactions agricoles",
    description: "AgriD vise à rendre les transactions agricoles simples, équitables et transparentes pour tous les acteurs.",
    icon: <Target className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Une plateforme au service de tous",
    subtitle: "Producteurs, Collecteurs, Consommateurs",
    description: "AgriD offre une interface intuitive pour créer des profils, gérer des annonces, et faciliter les commandes et paiements.",
    icon: <Users className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Bénéfices pour les acteurs",
    subtitle: "Producteurs, Collecteurs, Consommateurs",
    description: "AgriD améliore les revenus des producteurs, la gestion des collecteurs et l'accès des consommateurs à des produits locaux à prix justes.",
    icon: <Handshake className="text-green-500 dark:text-green-400" />,
  },
  {
    title: "Engagement pour le développement durable",
    subtitle: "Pratiques respectueuses de l'environnement",
    description: "AgriD promeut une agriculture durable en réduisant le gaspillage alimentaire et soutenant les pratiques respectueuses de l'environnement.",
    icon: <Leaf className="text-green-500 dark:text-green-400"/>,
  },
  {
    title: "Rejoignez le mouvement AgriD !",
    subtitle: "Vers un futur alimentaire plus juste",
    description: "AgriD aspire à transformer le système alimentaire mondial vers un futur plus juste et durable.",
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

export default function Description() {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <div className="flex w-full h-40 items-left justify-center">
        <Marquee pauseOnHover className="[--duration:20s] h-40">
          {firstRow.map((review) => (
            <ReviewCard key={review.subtitle} {...review} />
          ))}
        </Marquee>
      </div>
      <div className="flex w-full h-40 items-center justify-center">
        <Marquee reverse pauseOnHover className="[--duration:20s] h-40">
          {secondRow.map((review) => (
            <ReviewCard key={review.subtitle} {...review} />
          ))}
        </Marquee>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
