import { FaCcAmex, FaCcDiscover, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { FiCreditCard, FiDollarSign, FiSend } from "react-icons/fi";
import { CONTACT } from "./SocialLinks";

// The three ways to pay, shared by /pay and the booking confirmation.
export default function PaymentOptions({ orderNumber }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card flex flex-col p-6">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-jett-50 text-xl text-jett-600">
          <FiSend />
        </span>
        <h3 className="mt-5 font-sans text-lg font-bold">Zelle transfer</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Send to <strong className="break-all text-ink">{CONTACT.email}</strong> and put{" "}
          {orderNumber ? (
            <strong className="font-mono text-ink">{orderNumber}</strong>
          ) : (
            "your order number"
          )}{" "}
          in the note.
        </p>
      </div>
      <div className="card flex flex-col p-6">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sun-100 text-xl text-sunset-600">
          <FiDollarSign />
        </span>
        <h3 className="mt-5 font-sans text-lg font-bold">Cash on arrival</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Prefer to pay later? Pay your driver in cash when you&apos;re picked up.
        </p>
      </div>
      <div className="card flex flex-col p-6">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sand-200 text-xl text-ink">
          <FiCreditCard />
        </span>
        <h3 className="mt-5 font-sans text-lg font-bold">Card on arrival</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Visa, Mastercard, Discover and Amex accepted.
        </p>
        <div className="mt-3 flex gap-2 text-3xl">
          <FaCcVisa color="#1A1F71" aria-label="Visa" />
          <FaCcMastercard color="#EB001B" aria-label="Mastercard" />
          <FaCcDiscover color="#FF6000" aria-label="Discover" />
          <FaCcAmex color="#2E77BC" aria-label="American Express" />
        </div>
        <p className="mt-auto pt-4 text-xs font-semibold text-sunset-600">
          A 4% card processing fee applies.
        </p>
      </div>
    </div>
  );
}
