"use client"

import { createProject } from "@/app/actions"
import { useState } from "react"

export default function NewProjectBtn() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            {!isOpen && (
                <button onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    + New Project
                </button>
            )}

            {isOpen && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mt-2 max-w-md">
                    <h3 className="font-bold mb-2 text-slate-800">Create Project</h3>
                    
                    <form action={createProject} onSubmit={() => setIsOpen(false)}>
                        <div className="mb-3">
                            <input 
                                name="name" 
                                placeholder="Project Name" 
                                required 
                                className="w-full border p-2 rounded text-slate-900" 
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <textarea 
                                name="description" 
                                placeholder="Description (Optional)" 
                                className="w-full border p-2 rounded text-slate-900" 
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                type="submit" 
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                                Save
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsOpen(false)}
                                className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-3 py-1 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
      )}
        </div>
    )
}