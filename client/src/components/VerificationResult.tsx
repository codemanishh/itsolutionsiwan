import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationResultProps {
  certificate: any;
  isLoading: boolean;
  error: any;
}

export default function VerificationResult({ certificate, isLoading, error }: VerificationResultProps) {
  if (isLoading) {
    return null;
  }

  if (error || !certificate) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Certificate Not Found</AlertTitle>
        <AlertDescription>
          The certificate number you entered could not be verified. Please check the number and try again or contact our office for assistance.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <Alert className="bg-green-50 border-green-600 mb-4">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-600">Certificate Verified</AlertTitle>
      </Alert>
      
      <Card>
        <CardHeader className="bg-neutral-lightest border-b">
          <CardTitle className="text-base font-medium">Certificate Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral font-medium">Name</p>
              <p className="text-neutral-darkest">{certificate.name}</p>
            </div>
            <div>
              <p className="text-sm text-neutral font-medium">Certificate Number</p>
              <p className="text-neutral-darkest">{certificate.certificateNumber}</p>
            </div>
            <div>
              <p className="text-sm text-neutral font-medium">Course</p>
              <p className="text-neutral-darkest">{certificate.certificateName}</p>
            </div>
            <div>
              <p className="text-sm text-neutral font-medium">Issue Date</p>
              <p className="text-neutral-darkest">
                {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral font-medium">Aadhar Number</p>
              <p className="text-neutral-darkest">{certificate.aadharNumber}</p>
            </div>
            <div>
              <p className="text-sm text-neutral font-medium">Percentage Score</p>
              <p className="text-neutral-darkest">{certificate.percentageScore}%</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-neutral font-medium">Address</p>
              <p className="text-neutral-darkest">{certificate.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
