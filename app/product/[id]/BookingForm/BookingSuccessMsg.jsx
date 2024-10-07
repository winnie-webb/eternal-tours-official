import { AiOutlineCheckCircle } from "react-icons/ai";

function BookingSuccessMsg() {
  return (
    <div className="flex mt-8 flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <AiOutlineCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Booking Confirmed!
      </h1>
      <p className="text-gray-600 text-lg text-center max-w-md">
        Thank you! We’ve successfully received your details and will contact you
        immediately with a detailed quote. If you have any questions, feel free
        to reach out to us on our socials.
      </p>
      <button
        className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        onClick={() => (window.location.href = "/")}
      >
        Back to Home
      </button>
    </div>
  );
}

export default BookingSuccessMsg;
