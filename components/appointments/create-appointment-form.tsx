"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";


import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateAppointmentInput, createAppointmentSchema } from "@/lib/schemas/appointments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Doctor } from "@/actions/doctors";
// import { Label } from "../ui/label";
import { createAppointmentAction } from "@/actions/appointments";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircleIcon, InfoIcon } from "@phosphor-icons/react";


type CreateAppointmentFormProps = {
    // doctorId: number;
    doctors: Doctor[];

};

export function CreateAppointmentForm({
    // doctorId,
    doctors
}: CreateAppointmentFormProps) {
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

    const form = useForm<CreateAppointmentInput>({
        resolver: zodResolver(createAppointmentSchema),
        defaultValues: {
            doctorId: doctors[0]?.id,
            patientName: "",
            patientPhone: "",
            appointmentDate: new Date().toISOString().split("T")[0],
            startTime: "",
            endTime: "",
            notes: "",
        },
    });

    async function onSubmit(data: CreateAppointmentInput) {
        setServerError(null);
        const result = await createAppointmentAction(data);
        if (!result.success) {
            setServerError(result.error ?? null);
        } else {
            setSuccessMessage("Appointment created  you could create another appointment");
            form.reset({
                doctorId: doctors[0]?.id,
                patientName: "",
                patientPhone: "",
                appointmentDate: new Date().toISOString().split("T")[0],
                startTime: "",
                endTime: "",
                notes: "",
            });
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {serverError && (
                <Alert className="mb-4 bg-red-100 text-red-900">
                    <InfoIcon />
                    <AlertTitle>
                        An error occurred
                    </AlertTitle>
                    <AlertDescription>
                        {serverError}
                    </AlertDescription>
                </Alert>
            )}
            {successMessage && (
                <Alert className="mb-4">
                    <CheckCircleIcon />
                    <AlertTitle>
                        Success!
                    </AlertTitle>
                    <AlertDescription>
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}
            <FieldGroup  >
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="patientName"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Patient name
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter patient full name"
                                    autoComplete="name"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="patientPhone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Phone number
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter patient phone number like 01012345678"
                                    type="tel"
                                    autoComplete="tel"
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>
                <Controller
                    name="doctorId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Doctor
                            </FieldLabel>

                            <Select
                                value={field.value != null ? String(field.value) : undefined}
                                onValueChange={(value) => field.onChange((value))}
                            >
                                <SelectTrigger
                                    id={field.name}
                                    aria-invalid={fieldState.invalid}
                                >
                                    <SelectValue placeholder="Select Doctor" >
                                        {doctors.find((d) => d.id === field.value)?.name}

                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={String(doctor.id)}
                                        >
                                            {doctor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="appointmentDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Date
                            </FieldLabel>

                            <Input
                                {...field}
                                id={field.name}
                                type="date"
                                aria-invalid={fieldState.invalid}
                            />

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    Start time
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    type="time"
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    End time
                                </FieldLabel>

                                <Input
                                    {...field}
                                    id={field.name}
                                    type="time"
                                    aria-invalid={fieldState.invalid}
                                />

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="notes"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                                Notes
                            </FieldLabel>

                            <Textarea
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="Optional notes about the appointment..."
                                className="min-h-24 resize-none"
                            />

                            <FieldDescription>
                                Add any useful information for the doctor or clinic staff.
                            </FieldDescription>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />



                <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting
                        ? "Creating..."
                        : "Create appointment"}
                </Button>
            </FieldGroup>
        </form>
    );
}

