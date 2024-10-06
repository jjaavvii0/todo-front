import { Form, message } from "antd";
import { useState, useRef, useEffect } from "react";
import { isEqual } from "../helpers/utils";
import { DataType, EditingState } from "../types/types";
import {
    deleteDuty,
    getDuties,
    postDuty,
    updateDuty,
} from "../services/duty.service";

export function useTableData() {
    //useState
    const [data, setData] = useState<DataType[]>([]);
    const [editing, setEditing] = useState<EditingState>({
        row: null,
        column: "",
        data: {},
    });
    const [dataFormModal, setDataFormModal] = useState<Partial<DataType>>({});
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    //useOthers
    const [form] = Form.useForm();
    const initialDataReference = useRef<DataType[]>(data);

    //useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                const duties = await getDuties();
                setData(duties);
                initialDataReference.current = duties;
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    //ROWS MANAGEMENT (UPDATE)
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

    const handleSaveNewData = async (id: number) => {
        try {
            const fieldName = `${editing.column}_${id}`;
            await form.validateFields([fieldName]);
            const fieldValue = form.getFieldValue(fieldName);

            setData((prevData) =>
                prevData.map((item) =>
                    item.id !== id
                        ? item
                        : { ...item, [editing.column]: fieldValue }
                )
            );
            setEditing({
                row: null,
                column: "",
                data: {},
            });
        } catch (error: any) {
            console.log(error);
            if (error.hasOwnProperty("errorFields")) {
                message.error("Please fix the errors before saving");
            } else {
                message.error(
                    "An unexpected error occurred. Please try again."
                );
            }
        }
    };

    const handleUpdateRow = async (updatedData: any) => {
        try {
            const updatedRow = await updateDuty(updatedData);
            if (!updatedRow) return message.error("Fail updating the row");
            setData((prevData) => {
                const newDataValue = prevData.map((item) =>
                    item.id === updatedData.id
                        ? { ...item, ...updatedRow }
                        : item
                );
                initialDataReference.current = initialDataReference.current.map(
                    (item) =>
                        item.id === updatedData.id
                            ? { ...item, ...updatedRow }
                            : item
                );
                return newDataValue;
            });
            message.success("Row updated");
        } catch (error) {
            message.error("Fail updating the row");
        }
    };
    const checkIfRowModified = (id: number): boolean => {
        const original = initialDataReference.current.find(
            (item) => item.id === id
        );
        const current = data.find((item) => item.id === id);

        if (!original || !current) return false;
        return isEqual(original, current);
    };

    //ROWS MANAGEMENT (DELETE)
    const handleDeleteRow = async (id: number) => {
        try {
            await deleteDuty(id);
            setData((prevData) => prevData.filter((item) => item.id !== id));
            initialDataReference.current = initialDataReference.current.filter(
                (x) => x.id != id
            );
            message.success("Row deleted");
        } catch (e) {
            message.error("Fail deleting the row");
        }
    };

    //ROWS MANAGEMENT (ADD)
    const handleAddNewRow = (newData: DataType) => {
        setData((prevData) => {
            const updatedData = [...prevData, newData];
            initialDataReference.current = updatedData;
            return updatedData;
        });

        setIsFormModalOpen(false);
        setDataFormModal({});
        form.resetFields();
    };

    //MODAL FUNCTIONS
    const handleCancelModal = () => {
        setIsFormModalOpen(false);
        form.resetFields();
    };

    const handleSubmitModal = async () => {
        try {
            const values = await form.validateFields();
            const newRow = { ...values, status: false };
            const { data } = await postDuty(newRow);
            handleAddNewRow({ ...newRow, id: data.id });
            message.success("Row added");

            setEditing({
                row: null,
                column: "",
                data: {},
            });
        } catch (error: any) {
            if (error.hasOwnProperty("errorFields")) {
                message.error("Please fix the errors before saving");
            } else {
                message.error(
                    "An unexpected error occurred. Please try again."
                );
            }
        }
    };

    return {
        data,
        editing,
        toggleStatus,
        handleEditingCell,
        handleSaveNewData,
        handleDeleteRow,
        handleAddNewRow,
        setEditing,
        form,
        dataFormModal,
        setDataFormModal,
        isFormModalOpen,
        setIsFormModalOpen,
        handleSubmitModal,
        handleCancelModal,
        handleUpdateRow,
        checkIfRowModified,
    };
}
