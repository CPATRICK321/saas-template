import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { deleteProject } from "../actions";
import SignOut from "@/components/sign-out";
import NewProjectBtn from "@/components/new-project-btn";
import SubscriptionBtn from "@/components/subscription-btn";
import { checkSubscription } from "@/lib/subscription";

export default async function Dashbaord() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const projects = await prisma.project.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const isPro = await checkSubscription(session.user.id!)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Pantheon Technologies Dashboard</h1>
            <p className="text-slate-500">Welcome back, {session.user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <SubscriptionBtn isPro={isPro} />
          <SignOut /> 
        </div>
      </div>

      {/* Action Section */}
      <div className="mb-8">
        <NewProjectBtn />
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Empty State */}
        {projects.length === 0 && (
            <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-200 rounded-lg text-slate-500">
                <p>No projects yet. Create one to get started!</p>
            </div>
        )}

        {/* Project Cards */}
        {projects.map((project) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{project.name}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {project.description || "No description"}
                </p>
                <div className="text-xs text-slate-400">
                    Created: {project.createdAt.toLocaleDateString()}
                </div>
                <form action={deleteProject}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button 
                      type="submit" 
                      className="text-red-500 text-sm hover:text-red-700 font-medium transition-colors"
                  >
                      Delete
                  </button>
              </form>
            </div>
        ))}
      </div>
    </div>
  )
}