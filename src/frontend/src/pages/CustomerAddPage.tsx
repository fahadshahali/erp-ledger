import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddCustomer } from "@/hooks/useBackend";
import { parseCurrency } from "@/lib/currency";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormValues {
  companyName: string;
  customerName: string;
  mobile: string;
  gstNumber: string;
  address: string;
  openingBalance: string;
}

export function CustomerAddPage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useAddCustomer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      companyName: "",
      customerName: "",
      mobile: "",
      gstNumber: "",
      address: "",
      openingBalance: "0",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await mutateAsync({
        companyName: values.companyName,
        customerName: values.customerName,
        mobile: values.mobile,
        gstNumber: values.gstNumber,
        address: values.address,
        openingBalance: parseCurrency(values.openingBalance),
      });
      toast.success("Customer added successfully");
      navigate({ to: "/customers" as any });
    } catch {
      toast.error("Failed to add customer");
    }
  };

  return (
    <div className="p-6 max-w-2xl" data-ocid="customer_add.page">
      <div className="flex items-center gap-3 mb-6">
        <Link to={"/customers" as any}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            data-ocid="customer_add.back_button"
          >
            <ArrowLeft size={14} /> Back
          </Button>
        </Link>
        <h1 className="text-xl font-display font-bold text-foreground">
          Add Customer
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card border border-border rounded-lg p-6 space-y-5"
        data-ocid="customer_add.form"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              {...register("companyName", { required: true })}
              placeholder="ABC Gas Agency"
              data-ocid="customer_add.company_name_input"
            />
            {errors.companyName && (
              <p
                className="text-xs text-destructive"
                data-ocid="customer_add.company_name_field_error"
              >
                Required
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              {...register("customerName", { required: true })}
              placeholder="Rahman Traders"
              data-ocid="customer_add.customer_name_input"
            />
            {errors.customerName && (
              <p
                className="text-xs text-destructive"
                data-ocid="customer_add.customer_name_field_error"
              >
                Required
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              {...register("mobile", { required: true })}
              placeholder="9876543210"
              data-ocid="customer_add.mobile_input"
            />
            {errors.mobile && (
              <p
                className="text-xs text-destructive"
                data-ocid="customer_add.mobile_field_error"
              >
                Required
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input
              id="gstNumber"
              {...register("gstNumber")}
              placeholder="36ABCDE1234F1Z5"
              data-ocid="customer_add.gst_input"
            />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Full address..."
              rows={2}
              data-ocid="customer_add.address_textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="openingBalance">Opening Balance (₹)</Label>
            <Input
              id="openingBalance"
              {...register("openingBalance")}
              placeholder="50000"
              data-ocid="customer_add.opening_balance_input"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            data-ocid="customer_add.submit_button"
          >
            {isPending ? "Saving..." : "Add Customer"}
          </Button>
          <Link to={"/customers" as any}>
            <Button
              type="button"
              variant="outline"
              data-ocid="customer_add.cancel_button"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
