# Component Guide

Guide to using and extending components in the Valor Insurance Platform.

## Component Structure

Components are organized by category:
- `components/ui/` - Base UI components (shadcn/ui)
- `components/dashboard/` - Dashboard-specific components
- `components/cases/` - Case management components
- `components/quotes/` - Quote management components
- `components/layout/` - Layout components
- `components/forms/` - Form components
- `components/loading/` - Loading state components
- `components/error/` - Error state components

## Using Components

### Basic Usage

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Form Components

```tsx
import { InputField, SelectField } from "@/components/forms/form-field"

export function MyForm() {
  return (
    <form>
      <InputField
        label="Email"
        name="email"
        type="email"
        required
        error={errors.email}
      />
      <SelectField
        label="Status"
        name="status"
        options={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" }
        ]}
      />
    </form>
  )
}
```

### Data Tables

```tsx
import { DataTable } from "@/components/data-table/data-table"

const columns = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", sortable: true },
]

<DataTable
  data={users}
  columns={columns}
  onRowClick={(row) => router.push(`/users/${row.id}`)}
  keyExtractor={(row) => row.id}
/>
```

### Loading States

```tsx
import { Loading } from "@/components/ui/loading"
import { DashboardSkeleton } from "@/components/loading/dashboard-skeleton"

if (loading) {
  return <DashboardSkeleton />
}
```

### Error States

```tsx
import { ErrorDisplay } from "@/components/error/error-display"

<ErrorDisplay
  title="Error"
  message="Something went wrong"
  onDismiss={() => setError(null)}
/>
```

### Toast Notifications

```tsx
import { showSuccess, showError } from "@/lib/utils/toast-helpers"

showSuccess("Operation completed successfully")
showError("Operation failed")
```

### Status Badges

```tsx
import { StatusBadge } from "@/components/badges/status-badge"

<StatusBadge status="approved" size="md" />
```

### Charts

```tsx
import { SimpleChart } from "@/components/charts/simple-chart"

<SimpleChart
  title="Sales Over Time"
  data={chartData}
  dataKeys={["sales", "revenue"]}
  type="line"
/>
```

## Creating New Components

### Component Template

```tsx
"use client"

import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children?: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  )
}
```

### Best Practices

1. **Use TypeScript**: Always type component props
2. **Accessibility**: Include ARIA labels and keyboard navigation
3. **Error Handling**: Handle errors gracefully
4. **Loading States**: Show loading states for async operations
5. **Responsive**: Make components mobile-friendly
6. **Reusability**: Make components reusable with props
7. **Documentation**: Add JSDoc comments for complex components

## Component Patterns

### Controlled Components

```tsx
const [value, setValue] = useState("")

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Form Validation

```tsx
import { useFormValidation } from "@/hooks/use-form-validation"
import { validationRules } from "@/lib/utils/validation-helpers"

const { data, errors, setFieldValue, validate } = useFormValidation(
  initialData,
  {
    email: [validationRules.required(), validationRules.email()],
  }
)
```

### Async Operations

```tsx
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleSubmit = async () => {
  setLoading(true)
  setError(null)
  try {
    await submitData()
    showSuccess("Success!")
  } catch (err) {
    setError("Failed")
    showError("Failed")
  } finally {
    setLoading(false)
  }
}
```

## Styling

### Using Tailwind

```tsx
<div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
  Content
</div>
```

### Using cn() Utility

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}>
```

## Accessibility

### ARIA Labels

```tsx
<button aria-label="Close dialog">
  <X />
</button>
```

### Keyboard Navigation

```tsx
<button
  onKeyDown={(e) => {
    if (e.key === "Enter") handleClick()
  }}
>
```

### Focus Management

```tsx
import { trapFocus } from "@/lib/utils/accessibility"

useEffect(() => {
  const cleanup = trapFocus(modalRef.current)
  return cleanup
}, [])
```

