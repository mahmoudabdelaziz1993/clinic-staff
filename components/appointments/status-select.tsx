"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateAppointmentStatusAction } from "@/actions/appointments";
import {
    appointmentStatusEnum,
    type AppointmentStatus,
} from "@/lib/schemas/appointments";

const statusStyles: Record<AppointmentStatus, string> = {
    scheduled: " bg-blue-200 text-blue-800 border-blue-800",
    confirmed: " bg-emerald-200 text-emerald-800 border-emerald-800",
    completed: " bg-gray-200 text-gray-800 border-gray-800",
    cancelled: " bg-red-200 text-red-800 border-red-800",
    no_show: " bg-amber-200 text-amber-800 border-amber-800",
};

export function StatusSelect({
    appointmentId,
    status,
}: {
    appointmentId: number;
    status: AppointmentStatus;
}) {
    // Optimistic value — shows immediately on change
    const [optimistic, setOptimistic] = React.useState<AppointmentStatus>(status);
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    // If the server sends a fresh value (e.g. after router.refresh()), sync it
    React.useEffect(() => {
        setOptimistic(status);
    }, [status]);

    async function handleChange(next: AppointmentStatus | null) {
        if (!next) return;
        const nextStatus = next;
        const previous = optimistic;

        setError(null);
        setOptimistic(nextStatus);   // instant UI update
        setPending(true);

        const result = await updateAppointmentStatusAction({
            id: appointmentId,
            status: nextStatus,
        });

        setPending(false);

        if (!result.success) {
            setOptimistic(previous); // rollback
            setError(result.error);
            return;
        }

        // Tell the server component to refetch the list
        router.refresh();
    }

    return (
        <div className="flex flex-col gap-1">
            <Select
                value={optimistic}
                onValueChange={handleChange}
                disabled={pending}
            >
                <SelectTrigger
                    className={`${statusStyles[optimistic]} px-4 w-full transition-colors `}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {appointmentStatusEnum.options.map((s) => (
                        <SelectItem key={s} value={s}>
                            {s.replace(/_/g, " ")}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && (
                <span className="text-xs text-red-600">{error}</span>
            )}
        </div>
    );
}