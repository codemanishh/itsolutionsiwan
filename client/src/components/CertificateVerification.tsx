import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import VerificationResult from "./VerificationResult";
import { useQuery } from "@tanstack/react-query";

export default function CertificateVerification() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const { data: certificate, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [`/api/certificates/${certificateNumber}`],
    queryFn: async () => {
      if (!certificateNumber) return null;
      const res = await fetch(`/api/certificates/${certificateNumber}`, { credentials: 'include' });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to verify certificate');
      return res.json();
    },
    enabled: false,
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateNumber) {
      toast({
        title: "Error",
        description: "Please enter a certificate number",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    await refetch();
  };

  return (
    <section id="verify" className="py-12 bg-gradient-to-r from-[hsl(var(--primary-light))] to-[hsl(var(--primary))] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Certificate Verification</h2>
          <p className="max-w-2xl mx-auto">Verify the authenticity of your certificate by entering your certificate number below</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateNumber">Certificate Number</Label>
                  <Input 
                    id="certificateNumber"
                    type="text"
                    placeholder="Enter your certificate number"
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={isLoading || isRefetching}
                >
                  {(isLoading || isRefetching) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Certificate"
                  )}
                </Button>
              </form>

              {submitted && (
                <div className="mt-6">
                  <VerificationResult 
                    certificate={certificate} 
                    isLoading={isLoading || isRefetching}
                    error={error}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
