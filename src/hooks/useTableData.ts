import { Form, message } from "antd";
import { useState, useRef, useEffect } from "react";
import { isEqual } from "../helpers/utils";
import { DataType, EditingState } from "../types/types";


export function useTableData(initialData: DataType[]) {
    //useState
    const [data, setData] = useState<DataType[]>(initialData);
    const [isDataPending, setIsDataPending] = useState(false);
    const [editing, setEditing] = useState<EditingState>({
        row: null,
        column: "",
        data: {},
    });

    //useEffect
    useEffect(() => {
        setIsDataPending(isEqual(initialDataReference.current, data));
    }, [data]);

    //OTHERS
    const [form] = Form.useForm();
    const initialDataReference = useRef<DataType[]>(data);


    //EDIT MANAGEMENTS (UPDATE)
    const toggleStatus = (id: number) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, status: !item.status } : item
            )
        );
    };

    const handleEditingCell = (id: number, column: string) => {
        setEditing({ ...editing, column: column, row: id });
    };

    const handleSaveNewData = (id: number) => {
        form.validateFields()
            .then(() => {
                setData((prevData) =>
                    prevData.map((item) =>
                        item.id !== id ? item : { ...item, ...editing.data }
                    )
                );
                setEditing({
                    row: null,
                    column: "",
                    data: {},
                });
            })
            .catch(() => {
                message.error("Please fix the errors before saving.");
            });
    };

    //ROWS MANAGEMENT (DELETE,ADD)
    const handleDeleteRow = (id: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
    };

    const handleAddNewRow = () => { //TODO: DO A MODAL
        setData((prevData) => [
            ...prevData,
            {
                id: Math.random(),
                name: "name",
                status: false,
            },
        ]);
    };

    //OTHERS
    const handleDataToStore = () => {
        setIsDataPending(!isDataPending);
        console.log("Sending to server"); //TODO: REQUEST
        initialDataReference.current = data;
    };

    return {
        data,
        editing,
        isDataPending,
        toggleStatus,
        handleEditingCell,
        handleSaveNewData,
        handleDeleteRow,
        handleAddNewRow,
        handleDataToStore,
        setEditing,
        form,
    };
}
