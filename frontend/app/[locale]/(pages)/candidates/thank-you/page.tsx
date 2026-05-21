"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      router.replace("/candidates/thank-you");
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
     <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <img
            src="/images/logo.png"
            alt="logo"
            className="h-12 w-auto"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-semibold text-slate-800 mb-6">
          Thank you for your interaction with our system.
        </h1>

        {/* INFO BOX */}
        <div className="bg-slate-50 rounded-xl p-7 mb-8 text-left border-2 border-gray-300 space-y-5">

          <p className="text-sm text-gray-700">
            <span className="font-semibold text-slate-800">
              If you have just submitted your exam,
            </span>{" "}
            your answers have been successfully recorded.
          </p>

          <p className="text-sm text-gray-700">
            <span className="font-semibold text-slate-800">
              If you were trying to access an exam,
            </span>{" "}
            please note that the request could not be completed for one of the following reasons:
          </p>

          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>
              <span className="font-medium text-slate-800">
                The exam window
              </span>{" "}
              is currently closed or unavailable.
            </li>

            <li>
              You may have already submitted this exam and{" "}
              <span className="font-medium text-slate-800">
                retaking is not allowed.
              </span>
            </li>

            <li>
              The exam link may be{" "}
              <span className="font-medium text-slate-800">
                invalid or expired.
              </span>
            </li>
          </ul>

          <p className="text-sm text-gray-700">
            Please ensure you are using a{" "}
            <span className="font-semibold text-slate-800">
              valid and active exam link.
            </span>
          </p>

          <p className="text-sm text-gray-700">
            If you believe this is an error or you are facing any issues, feel free to contact our support team.
          </p>

        </div>

        {/* CONTACT */}
        <div className="text-sm text-slate-500">
          For assistance, contact us at:{" "}
          <span className="font-medium text-slate-700">
            support@enozom.com
          </span>
        </div>

      </div>
    </div>
  );
}