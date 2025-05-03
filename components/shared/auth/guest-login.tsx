"use client";

import { guestLogin } from "@/actions/guest-login";
import { FormError } from "@/components/shared/form-error";
import { FormSuccess } from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export const GuestLogin = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onGuestLogin = () => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await guestLogin(callbackUrl);
      if (res?.error) {
        setError(res.error);
      }
      if (res?.success) {
        setSuccess(res.success);
      }
    });
  };

  return (
    <div className="w-full space-y-4">
      <FormError message={error} />
      <FormSuccess message={success} />

      <Button
        type="button"
        variant="outline"
        onClick={onGuestLogin}
        disabled={isPending}
        className="w-full text-[13px]"
      >
        Continue As Guest
      </Button>
    </div>
  );
};
