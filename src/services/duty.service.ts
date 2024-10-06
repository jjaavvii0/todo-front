import axios from "axios";
import { DataType } from "../types/types";

const urlBackend ="http://localhost:3000"

export const getDuties = async () => {
    try {
        const { data } = await axios.get(`${urlBackend}/duty`);
        return data;
    } catch (error) {
        console.error("Error fetching duties:", error);
        throw new Error("Failed to fetch duties.");
    }
};

export const postDuty = async (body: Partial<DataType>) => {
    try {
        const { data } = await axios.post(`${urlBackend}/duty`, body);
        return data;
    } catch (error) {
        console.error("Error creating duty:", error);
        throw new Error("Failed to create duty.");
    }
};

export const deleteDuty = async (id: number) => {
    try {
        const { data } = await axios.delete(`${urlBackend}/duty/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting duty:", error);
        throw new Error(`Failed to delete duty with ID ${id}.`);
    }
};

export const updateDuty = async (body: Partial<DataType>) => {
    try {
        const { data } = await axios.put(
            `${urlBackend}/duty/${body.id}`,
            body
        );
        return data;
    } catch (error) {
        console.error("Error updating duty:", error);
        throw new Error("Failed to update duty.");
    }
};
