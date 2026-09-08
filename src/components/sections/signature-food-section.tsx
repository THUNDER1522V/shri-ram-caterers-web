import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Utensils } from "lucide-react";

interface FoodItem {
  category: string;
  name: string;
  description: string;
  imagePlaceholder: string;
}

const dishes: FoodItem[] = [
  {
    category: "[Royal Mains]",
    name: "[Dal Makhani Bukhara & Shahi Paneer]",
    description:
      "[Slow-cooked overnight in traditional brass vessels with churned white butter, aromatic whole spices, and rich heritage gravies.]",
    imagePlaceholder: "[Slow-Cooked Royal Dal & Shahi Paneer Photography]",
  },
  {
    category: "[Live Tandoor & Starters]",
    name: "[Artisan Tandoori Kebabs & Stuffed Kulchas]",
    description:
      "[Freshly baked Amritsari chur-chur kulchas and smoked vegetarian galouti kebabs paired with house-made berry and mint chutneys.]",
    imagePlaceholder: "[Fresh Tandoor Kulchas & Sizzling Starters Photography]",
  },
  {
    category: "[Street Food Theatre]",
    name: "[Old Delhi Chaat & Nitrogen Live Counter]",
    description:
      "[Crisp palak patta chaat, stuffed golgappas with spiced mineral water infusions, and handcrafted dahi bhallas prepared live.]",
    imagePlaceholder: "[Interactive Live Chaat Station Photography]",
  },
  {
    category: "[Royal Desserts]",
    name: "[Saffron Malai Ghevar & Hot Jalebi Rabri]",
    description:
      "[Traditional Rajasthani ghevar garnished with silver vark and pistachio shavings alongside crisp live jalebis made with pure desi ghee.]",
    imagePlaceholder: "[Artisan Wedding Desserts & Live Sweet Counter Photography]",
  },
];

export function SignatureFoodSection() {
  return (
    <Section id="experiences">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
            [Culinary Mastery]
          </span>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            [Signature Food & Royal Menus]
          </h2>
          <p className="mt-4 font-body text-base text-muted-foreground">
            [Every dish is prepared under master chef supervision, honoring time-tested Indian culinary traditions using premium pure ingredients.]
          </p>
        </div>

        {/* Dishes Showcase Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {dishes.map((dish, idx) => (
            <Card key={idx} className="flex flex-col overflow-hidden">
              <div className="relative aspect-square w-full border-b border-border bg-muted">
                <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                  <Utensils className="h-6 w-6 text-gold-600/70" aria-hidden="true" />
                  <span className="mt-2 text-xs font-medium text-muted-foreground">
                    {dish.imagePlaceholder}
                  </span>
                </div>
              </div>

              <CardHeader className="p-5 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {dish.category}
                </span>
                <CardTitle className="mt-1 text-lg">
                  {dish.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <p className="font-body text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {dish.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
