import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const [investment, setInvestment] = useState(null);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!sessionId) {
        setStatus("failed");
        setMessage("The payment link is missing its Checkout Session ID.");
        return;
      }

      setStatus("loading");
      setMessage("");
      try {
        const response = await apiFetch("/api/champaign/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const result = await response.json();

        if (!active) return;
        if (result.status === "pending") {
          setStatus("pending");
          setMessage(result.message || "Your payment is still processing.");
          return;
        }
        if (!response.ok || !result.recorded || !result.investment) {
          throw new Error(result.message || "We could not verify this payment.");
        }

        setInvestment(result.investment);
        setStatus("paid");
      } catch (error) {
        if (!active) return;
        setStatus("failed");
        setMessage(error.message || "We could not verify this payment. Please try again.");
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [sessionId, retry]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      {status === "loading" && (
        <>
          <h1 className="mb-3 text-3xl font-bold">Verifying your payment</h1>
          <p>Please wait while we confirm the payment with Stripe.</p>
        </>
      )}

      {status === "pending" && (
        <>
          <h1 className="mb-3 text-3xl font-bold">Payment processing</h1>
          <p className="mb-5">{message}</p>
          <button
            className="mb-4 rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => setRetry((value) => value + 1)}
          >
            Check again
          </button>
        </>
      )}

      {status === "failed" && (
        <>
          <h1 className="mb-3 text-3xl font-bold">Payment not confirmed</h1>
          <p className="mb-5">{message}</p>
          <button
            className="mb-4 rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => setRetry((value) => value + 1)}
          >
            Try again
          </button>
          <Link className="mb-4 text-blue-700 underline" to="/signin">
            Sign in and check again
          </Link>
        </>
      )}

      {status === "paid" && investment && (
        <div className="w-full rounded-lg bg-slate-100 p-8 shadow-lg">
          {investment.coverImage && (
            <img
              src={investment.coverImage}
              alt={investment.title}
              className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
            />
          )}
          <h1 className="mb-4 text-3xl font-semibold">Payment confirmed</h1>
          <p className="mb-2">
            Your ${investment.invested.toFixed(2)} investment in {investment.title} has been recorded.
          </p>
          {investment.tip > 0 && (
            <p className="mb-2">Your ${investment.tip.toFixed(2)} tip was included in the charge.</p>
          )}
          <p className="mb-6">
            {investment.isBuffer ? "Potential buffer equity recorded:" : "Equity recorded:"} {investment.equity}%
          </p>
          <Link className="mr-3 rounded bg-blue-600 px-4 py-2 text-white" to="/">
            Home
          </Link>
          <Link
            className="rounded bg-blue-600 px-4 py-2 text-white"
            to={`/detailedChamapaign/${investment.campaignId}`}
          >
            View campaign
          </Link>
        </div>
      )}

      {status !== "paid" && (
        <Link className="mt-4 text-blue-700 underline" to="/">
          Return home
        </Link>
      )}
    </main>
  );
};

export default Success;
