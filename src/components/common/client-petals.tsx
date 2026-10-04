"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { PetalsProps } from "@/components/Petals";

const Petals = dynamic(() => import("@/components/Petals"), { ssr: false });

export function ClientPetals(props: PetalsProps) {
  return <Petals {...props} />;
}
