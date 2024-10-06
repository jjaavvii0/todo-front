import axios from "axios";
import { DataType } from "../types/types";

export const getDuties = async () => {
    const { data: duties } = await axios.get("http://localhost:3000/duty");
    return duties;
};

export const postDuty = async (body: Partial<DataType>) => {
    const data = await axios.post("http://localhost:3000/duty",body);
    return data
}

export const deleteDuty = async (id:number) => {
    const {data} = await axios.delete(`http://localhost:3000/duty/${id}`)
    console.log(data.message)
}

export const updateDuty = async (body: Partial<DataType>) => {
    try {
        const { data } = await axios.put(`http://localhost:3000/duty/${body.id}`, body);
        console.log("Updated Duty:", data);
        return data;
    } catch (error) {
        console.error("Error updating duty:", error);
    }
};