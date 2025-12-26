import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { deleteProject } from "../actions"
import SignOut from "@/components/sign-out"
import NewProjectBtn from "@/components/new-project-btn"
import SubscriptionBtn from "@/components/subscription-btn"
import { checkSubscription } from "@/lib/subscription"
import { Project } from "@prisma/client"
import { Calendar, Trash2, FolderOpen, CreditCard, User as UserIcon } from "lucide-react"

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const projects = await prisma.project.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const isPro = await checkSubscription(session.user.id!)

  // Helper to format dates cleanly (e.g., "Oct 24, 2024")
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                SaaS Project
              </span>
            </div>
            <div className="flex items-center gap-4">
               {/* User Dropdown/Area */}
              <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-100/50 py-1.5 px-3 rounded-full border border-slate-200/60">
                <UserIcon className="w-4 h-4" />
                <span className="font-medium text-slate-900">{session.user.name}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <SignOut />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 2. Header Section with Stats/Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="mt-2 text-slate-600">
              Manage your projects and subscription settings.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <SubscriptionBtn isPro={isPro} />
             <NewProjectBtn />
          </div>
        </div>

        {/* 3. Subscription Status Banner */}
        {!isPro && projects.length >= 1 && (
           <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-amber-900 text-sm">
              <span className="flex items-center gap-2">
                 <CreditCard className="w-4 h-4" />
                 <span>You are on the <strong>Free Plan</strong> (1 project limit).</span>
              </span>
           </div>
        )}

        {/* 4. Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-slate-300 rounded-xl bg-slate-50/50">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No projects yet</h3>
              <p className="text-slate-500 max-w-sm text-center mt-1 mb-6">
                Get started by creating your first project. Free users can create 1 project.
              </p>
              <NewProjectBtn />
            </div>
          ) : (
            projects.map((project: Project) => (
              <div 
                key={project.id} 
                className="group flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FolderOpen className="w-5 h-5" />
                    </div>
                    {/* Date Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.updatedAt)}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {project.description || "No description provided for this project."}
                  </p>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-400">
                    Status: Active
                  </span>
                  <form action={deleteProject}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <button 
                        type="submit" 
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Delete Project"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}