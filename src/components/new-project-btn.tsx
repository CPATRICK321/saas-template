"use client"

import { createProject } from "@/app/actions"
import { useState } from "react"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewProjectBtn() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    const result = await createProject(formData)

    if (result?.status === "error") {
        toast.error(result.message)
    } else {
        toast.success(result.message)
        setOpen(false)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      
      {/* Content wrapper that handles the width and white background automatically */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Project Name Group */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-left">
                Project Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Q4 Marketing Campaign"
                required
                className="col-span-3"
              />
            </div>
            
            {/* Description Group */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-left">
                Description <span className="text-slate-400 font-normal text-xs">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of your project..."
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            {/* Type="button" prevents form submission on Cancel */}
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}