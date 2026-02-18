import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "password";
    isTextArea?: boolean;
}

const FormField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    isTextArea = false,
}: FormFieldProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="label">{label}</FormLabel>
                    <FormControl>
                        {isTextArea ? (
                            <Textarea
                                className="input min-h-[120px] bg-[#020408]/60 border-white/5 focus:border-primary-200/50 transition-colors"
                                placeholder={placeholder}
                                {...field}
                            />
                        ) : (
                            <Input
                                className="input bg-[#020408]/60 border-white/5 focus:border-primary-200/50 transition-colors"
                                type={type}
                                placeholder={placeholder}
                                {...field}
                            />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormField;
