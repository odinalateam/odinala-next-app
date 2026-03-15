import { Check, X } from "lucide-react";

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains a letter",
      met: /[a-zA-Z]/.test(password),
    },
    {
      label: "Contains a number",
      met: /[0-9]/.test(password),
    },
  ];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      {requirements.map((req) => (
        <div key={req.label} className="flex items-center gap-2 text-xs">
          {req.met ? (
            <Check className="size-3 text-emerald-500" />
          ) : (
            <X className="size-3 text-muted-foreground" />
          )}
          <span
            className={
              req.met ? "text-emerald-500" : "text-muted-foreground"
            }
          >
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
}
