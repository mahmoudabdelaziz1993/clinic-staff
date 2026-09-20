import { Button } from "@/components/ui/button"
import { getDoctors } from "@/actions/doctors"
import { CreateAppointmentForm } from "@/components/appointments/create-appointment-form";
import { createAppointmentAction } from "@/actions/appointments";

export default async function Page() {
  const doctors = await getDoctors();
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <ul>
            {doctors.map((doctor) => (
              <li key={doctor.id}> {doctor.id}. {doctor.name}-{doctor.specialty}</li>
            ))}
          </ul>
          <p>We&apos;ve already added the button component for you.</p>



          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
