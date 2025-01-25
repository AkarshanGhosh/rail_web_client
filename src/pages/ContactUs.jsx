import ContactUsComponent from "../components/ContactUs/ContactUs";

// Rename the local component
const ContactUs = () => {
  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <ContactUsComponent />
      </div>
    </div>
  );
};

export default ContactUs;
