"use client"
import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CreateAppointmentForm } from "./create-appointment-form";
import { Doctor } from "@/lib/schemas/doctors";
import { ScrollArea } from "../ui/scroll-area";
export default function AppointmentPageHeader({ doctors }: { doctors: Doctor[] }) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Appointments</h1>

            <Sheet>
                <SheetTrigger render={
                    <Button>
                        <PlusIcon />
                        Create Appointment
                    </Button>
                }></SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Create Appointment</SheetTitle>
                        {/* <SheetDescription>Fill in the details below to create a new appointment</SheetDescription> */}
                    </SheetHeader>
                    <ScrollArea className="px-8 max-h-[85vh]">
                        <CreateAppointmentForm doctors={doctors} />
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
}