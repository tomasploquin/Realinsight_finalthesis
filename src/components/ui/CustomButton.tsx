
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants
        glass: "glass shadow-soft border border-white/20 hover:shadow-elegant hover:bg-white/80 dark:hover:bg-black/40 text-foreground",
        primary: "bg-real-estate-600 text-white shadow-md hover:bg-real-estate-700 hover:shadow-lg",
        accent: "bg-gradient-to-r from-real-estate-600 to-real-estate-500 text-white shadow-md hover:shadow-lg hover:from-real-estate-700 hover:to-real-estate-600",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <Button
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "relative text-transparent hover:text-transparent",
          className
        )}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export { CustomButton, buttonVariants };
