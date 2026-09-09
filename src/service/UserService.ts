import type { User } from "../types/ExternalTypes";

export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) throw new Error("Failed to fetch User[]");

        const data: User[] = await response.json();
        return data;
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function addUser(user: User): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error("Failed to post new user!");
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function updateUser(updatedUser: User): Promise<void> {
    try {
        const response = await fetch(`http://localhost:3000/users/${updatedUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser)
        });
        if (!response.ok) throw new Error("Failed to updated user!");
    } catch (error: any) {
        throw new Error(error);
    }
}