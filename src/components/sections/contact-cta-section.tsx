"use client";

import * as React from "react";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export function ContactCTASection() {
  return (
    <Section id="contact" className="py-20 md:py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Direct Consultation Info */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <span className="font-heading text-xs uppercase tracking-[0.25em] text-gold-600 md:text-sm">
                [Begin Your Celebration]
              </span>
              <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
                [Plan Your Grand Wedding Feast With Us]
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-muted-foreground">
                [Speak directly with our senior catering directors to discuss dates, custom menu preferences, and schedule a private family tasting session.]
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3 text-sm text-foreground">
                  <Phone className="h-5 w-5 text-gold-600" aria-hidden="true" />
                  <span>{siteConfig.contact.phoneFormatted}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-foreground">
                  <Mail className="h-5 w-5 text-gold-600" aria-hidden="true" />
                  <span>{siteConfig.contact.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-foreground">
                  <MapPin className="h-5 w-5 text-gold-600" aria-hidden="true" />
                  <span>[New Delhi & NCR &bull; Destination Catering Across India]</span>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto">
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  <span>WhatsApp Chat</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a
                  href={siteConfig.links.phone}
                  className="inline-flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Call Us Directly</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column: Inquiry Form Skeleton */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  [Request a Custom Menu & Tasting]
                </CardTitle>
                <p className="font-body text-sm text-muted-foreground">
                  [Share your event details below and our team will get back to you within 4 hours.]
                </p>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-5"
                  aria-label="Event Catering Inquiry Form"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="full-name" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                        [Your Full Name]
                      </label>
                      <Input
                        id="full-name"
                        name="fullName"
                        placeholder="[e.g. Rajesh Sharma]"
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone-number" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                        [Phone / WhatsApp Number]
                      </label>
                      <Input
                        id="phone-number"
                        name="phoneNumber"
                        type="tel"
                        placeholder="[+91 98765 43210]"
                        className="mt-1.5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="event-date" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                        [Event Date]
                      </label>
                      <div className="relative mt-1.5">
                        <Input
                          id="event-date"
                          name="eventDate"
                          type="date"
                          className="w-full"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="guest-count" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                        [Estimated Guest Count]
                      </label>
                      <Input
                        id="guest-count"
                        name="guestCount"
                        type="number"
                        placeholder="[e.g. 500]"
                        className="mt-1.5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="event-details" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                      [Event Type & Special Preferences]
                    </label>
                    <textarea
                      id="event-details"
                      name="eventDetails"
                      rows={3}
                      placeholder="[e.g. Wedding Reception in Delhi, require Live Chaat counters and pure vegetarian multi-cuisine menu]"
                      className="mt-1.5 flex w-full rounded-input border border-input bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <Button type="submit" variant="default" size="lg" className="w-full">
                    [Submit Catering Inquiry]
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
