"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { subjects } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { createCompanion } from "@/lib/actions/companion.actions";
import { redirect } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, { message: 'Companion name is required.' }),
    subject: z.string().min(1, { message: 'Domain/Subject is required.' }),
    topic: z.string().min(1, { message: 'Focus topic is required.' }),
    voice: z.string().min(1, { message: 'Voice persona is required.' }),
    style: z.string().min(1, { message: 'Teaching style is required.' }),
    duration: z.coerce.number().min(1, { message: 'Session duration is required.' }),
})

const CompanionForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject: '',
            topic: '',
            voice: '',
            style: '',
            duration: 15,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const companion = await createCompanion(values);

        if (companion) {
            redirect(`/companions/${companion.id}`);
        } else {
            console.log('Failed to create a companion');
            redirect('/');
        }
    }

    return (
        <div className="border border-slate-200 bg-white p-8 sm:p-10 rounded-3xl shadow-sm w-full max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Design Your AI Tutor</h2>
                <p className="text-slate-500 mt-1">Configure the expertise, voice, and teaching style for your EunoiaLab session.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-800 font-semibold text-base">AI Tutor Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="e.g., Prof. Alan or EunoiaBot"
                                        {...field}
                                        className="input mt-1"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-800 font-semibold text-base">Primary Domain</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="input mt-1 capitalize">
                                            <SelectValue placeholder="Select the teaching domain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map((subject) => (
                                                <SelectItem
                                                    value={subject}
                                                    key={subject}
                                                    className="capitalize"
                                                >
                                                    {subject}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-800 font-semibold text-base">Specific Topic or Focus Area</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Ex. Artificial Intelligence, LMS Administration, or Object-Oriented Programming (OOP)"
                                        {...field}
                                        className="input mt-1 resize-none"
                                        rows={3}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                        <FormField
                            control={form.control}
                            name="voice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-800 font-semibold text-base">Voice Persona</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="input mt-1">
                                                <SelectValue
                                                    placeholder="Select a voice"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">
                                                    Male (Baritone)
                                                </SelectItem>
                                                <SelectItem value="female">
                                                    Female (Soprano)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="style"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-800 font-semibold text-base">Teaching Style</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="input mt-1">
                                                <SelectValue
                                                    placeholder="Select an approach"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="formal">
                                                    Formal & Academic
                                                </SelectItem>
                                                <SelectItem value="casual">
                                                    Casual & Interactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-800 font-semibold text-base">Target Session Duration (Minutes)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="15"
                                        {...field}
                                        className="input mt-1"
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />

                    <div className="pt-4">
                        <Button type="submit" className="w-full cursor-pointer py-6 text-base font-semibold rounded-xl">
                            Initialize AI Tutor
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default CompanionForm