import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface HealthMetricCardProps {
  title: string;
  icon?: ReactNode;
  value?: string | number;
  unit?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function HealthMetricCard({
  title,
  icon,
  value,
  unit,
  description,
  action,
  children,
}: HealthMetricCardProps) {
  return (
    <Card padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-berry">{icon}</span>}
          <h3 className="font-semibold text-ink/90">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      
      {(value !== undefined || description) && (
        <div className="flex flex-col gap-1">
          {value !== undefined && (
            <div className="flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold text-ink">
                {value}
              </span>
              {unit && <span className="text-sm font-medium text-ink/60">{unit}</span>}
            </div>
          )}
          {description && (
            <p className="text-sm text-ink/60">{description}</p>
          )}
        </div>
      )}
      
      {children && <div className="mt-2">{children}</div>}
    </Card>
  );
}
