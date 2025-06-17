import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva(
  "flex flex-col items-center justify-center",
  {
    variants: {
      size: {
        sm: "scale-50",
        md: "scale-75",
        lg: "scale-100",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

export interface LoaderProps extends VariantProps<typeof loaderVariants> {}

export default function Loader({ size }: LoaderProps) {
  return (
    <div className={cn(loaderVariants({ size }))}>
      <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="mt-2 text-blue-700 font-semibold">Loading...</span>
    </div>
  );
}
