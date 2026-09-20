import { CreateAppointmentForm } from "@/components/appointments/create-appointment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDoctors } from "@/actions/doctors";

export default async function CreateAppointmentPage() {
    const doctors = await getDoctors();
    return (

        <Card className="my-10 mx-auto max-w-md">
            <CardHeader>
                <CardTitle>Create Appointment</CardTitle>
                <CardDescription>
                    Fill in the details below to create a new appointment
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CreateAppointmentForm doctors={doctors} />
            </CardContent>
        </Card>



    );
}