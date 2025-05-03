import { CardWrapper } from "@/components/shared/auth/card-wrapper";
import { AlertTriangle } from "lucide-react";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something Went Wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        <AlertTriangle className="size-5 text-destructive" />
      </div>
    </CardWrapper>
  );
};
