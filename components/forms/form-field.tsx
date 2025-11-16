"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface FormFieldProps {
  label: string
  name: string
  error?: string
  required?: boolean
  description?: string
  className?: string
}

interface InputFieldProps extends FormFieldProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface TextareaFieldProps extends FormFieldProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}

interface SelectFieldProps extends FormFieldProps {
  value?: string
  onValueChange?: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export function FormField({ label, name, error, required, description, className, children }: FormFieldProps & { children: React.ReactNode }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export function InputField({
  label,
  name,
  error,
  required,
  description,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
}: InputFieldProps) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      required={required}
      description={description}
      className={className}
    >
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(error && "border-destructive")}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <div id={`${name}-error`} className="sr-only">{error}</div>}
    </FormField>
  )
}

export function TextareaField({
  label,
  name,
  error,
  required,
  description,
  placeholder,
  value,
  onChange,
  rows = 4,
  className,
}: TextareaFieldProps) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      required={required}
      description={description}
      className={className}
    >
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={cn(error && "border-destructive")}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <div id={`${name}-error`} className="sr-only">{error}</div>}
    </FormField>
  )
}

export function SelectField({
  label,
  name,
  error,
  required,
  description,
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      name={name}
      error={error}
      required={required}
      description={description}
      className={className}
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <div id={`${name}-error`} className="sr-only">{error}</div>}
    </FormField>
  )
}

