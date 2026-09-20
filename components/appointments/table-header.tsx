"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    appointmentStatusEnum,
    type AppointmentStatus,
} from "@/lib/schemas/appointments";
import { Doctor } from "@/lib/schemas/doctors";
import { Label } from "../ui/label";
import { BroomIcon, CalendarHeartIcon, StethoscopeIcon } from "@phosphor-icons/react";

const ALL = "__all__";

export default function AppointmentsTableFilters({
    doctors,
    selectedDoctor,
    selectedStatus,
}: {
    doctors: Doctor[];
    selectedDoctor?: number;
    selectedStatus?: AppointmentStatus;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const doctorValue = selectedDoctor ? String(selectedDoctor) : ALL;
    const statusValue = selectedStatus ?? ALL;

    function update(key: string, value: string) {
        const next = new URLSearchParams(searchParams.toString());
        if (value === ALL) next.delete(key);
        else next.set(key, value);
        router.push(`${pathname}?${next.toString()}`);
    }

    const hasFilters = doctorValue !== ALL || statusValue !== ALL;

    return (
        <div className="flex flex-wrap items-center justify-end gap-3  mb-4">

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex gap-2 items-center">
                    <Label><StethoscopeIcon className="size-6" /></Label>
                    <Select
                        value={doctorValue}
                        onValueChange={(v) => update("doctor", v as string)}
                    >
                        <SelectTrigger >
                            <SelectValue>{doctors.find((d) => d.id === selectedDoctor)?.name || "All"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All doctors</SelectItem>
                            {doctors.map((d) => (
                                <SelectItem key={d.id} value={String(d.id)}>
                                    {d.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2 items-center">
                    <Label><CalendarHeartIcon className="size-6" /></Label>
                    <Select
                        value={statusValue}
                        onValueChange={(v) => update("status", v as string)}
                    >
                        <SelectTrigger >
                            <SelectValue>{statusValue === ALL ? "All" : statusValue}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            {appointmentStatusEnum.options.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s.replace(/_/g, " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {hasFilters && (
                    <Button
                        variant="destructive"
                        onClick={() => router.push(pathname)}
                    >
                        <BroomIcon />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}