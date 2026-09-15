import type { User } from "../types/ExternalTypes";
import { addUser, updateUser } from "./UserService";


describe("User Service", () => {
    test("POST new user to users endpoint", async () => {
        // Arrange
        const testUser: User = {
            name: "Test User",
            email: "test@test.mail",
            password: "testpassword"
        }

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => testUser
        } as Response);

        // Act
        await addUser(testUser);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:3000/users",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(testUser)
            }
        );
    });


    test("PATCH existing user to users endpoint", async () => {
        // Arrange
        const updatedUser: User = {
            id: 0,
            name: "Updated User",
            email: "test@test.mail",
            password: "testpassword"
        };

        const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => updatedUser
        } as Response);

        // Act
        await updateUser(updatedUser);

        // Assert
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            `http://localhost:3000/users/${updatedUser.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            }
        );
    });


});