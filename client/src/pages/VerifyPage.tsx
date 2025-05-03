import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificateVerification from "@/components/CertificateVerification";

export default function VerifyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">Certificate Verification</h1>
            <p className="mt-2 text-lg">Verify the authenticity of certificates issued by IT Solution Computer Center</p>
          </div>
        </div>
        
        <div className="py-12">
          <div className="container mx-auto px-4">
            <CertificateVerification />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}