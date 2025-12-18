"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {

    // authenticate user
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    // get form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    // create project in the db
    await prisma.project.create({
        data: {
            name,
            description,
            userId: session.user.id,
        },
    })

    // purge cached data for the dashboard page
    revalidatePath("/dashboard")
}


export async function deleteProject(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const projectId = formData.get("projectId") as string

    await prisma.project.deleteMany({
        where: {
            id: projectId,
            userId: session.user.id, // important, only delete my own project
        },
    })

  revalidatePath("/dashboard")
}