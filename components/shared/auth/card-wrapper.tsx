"use client";

import { BackButton } from "@/components/shared/auth/back-button";
import { Header } from "@/components/shared/auth/header";
import { Social } from "@/components/shared/auth/social";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { GuestLogin } from "./guest-login";

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  showGuestLogin?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  showGuestLogin,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <div className="w-full space-y-4">
          {showGuestLogin && <GuestLogin />}
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </div>
      </CardFooter>
    </Card>
  );
};
