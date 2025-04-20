/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

type iconType = | ReactNode | {
  icon: ReactNode,
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
};

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: iconType; // Icon before the text
  endIcon?: iconType; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-primary text-white shadow-theme-xs font-semibold",
    outline:
      "bg-white border border-primary border-1 text-primary font-semibold",
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${sizeClasses[size]
        } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center"
        onClick={(e) => {
          const handler = (startIcon as any)?.onClick
          if (typeof handler === "function") {
            e.stopPropagation() // prevent button click
            handler(e)
          }
        }}
      >{typeof startIcon === "object" && "icon" in startIcon ? startIcon.icon : startIcon}</span>}

      {children}

      {endIcon && (
        <span
          className="flex items-center"
          onClick={(e) => {
            const handler = (endIcon as any)?.onClick
            if (typeof handler === "function") {
              e.stopPropagation(); // prevent button click
              handler(e)
            }
          }}
        >
          {typeof endIcon === "object" && "icon" in endIcon ? endIcon.icon : endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
