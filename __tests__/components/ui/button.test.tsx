import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies variant classes", () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    const button = container.querySelector("button")
    expect(button).toHaveClass("bg-destructive")
  })

  it("handles click events", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    const button = screen.getByText("Click")
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText("Disabled")
    expect(button).toBeDisabled()
  })
})

