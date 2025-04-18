import "server-only"

import prisma from "@/lib/db"
import { User } from "@prisma/client"

export async function getTypeById(id: string): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			id
		}
	})
}
