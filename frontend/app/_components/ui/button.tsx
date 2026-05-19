import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
  soft: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
} as const;

const sizes = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-4 py-2 sm:px-6 sm:py-3 text-base",
  icon: "p-2 text-sm",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLinkProps = BaseButtonProps & {
  as: "link";
  href: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function getClassName(variant: ButtonVariant, size: ButtonSize, className: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const sharedClassName = getClassName(variant, size, className);

  if (props.as === "link") {
    return (
      <Link href={props.href} className={sharedClassName}>
        {children}
      </Link>
    );
  }

  const {
    as: _as,
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...buttonProps
  } = props;

  return (
    <button className={sharedClassName} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
