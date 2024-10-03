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
    const [dataFormModal, setDataFormModal] = useState<Partial<DataType>>({});
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    //useEffect
    useEffect(() => {
        setIsDataPending(isEqual(initialDataReference.current, data));
    }, [data]);

    //useOthers
    const [form] = Form.useForm();
    const initialDataReference = useRef<DataType[]>(data);

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

    //ROWS MANAGEMENT (DELETE)
    const handleDeleteRow = (id: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
    };

    //ROWS MANAGEMENT (ADD)
    const handleAddNewRow = (data: DataType) => {
        setData((prevData) => [...prevData, data]);
        setIsFormModalOpen(false);
        setDataFormModal({});
        form.resetFields();
    };
    const handleSubmitModal = () => {
        //TODO: REQUEST
        form.validateFields()
            .then((values) => {
                handleAddNewRow({
                    id: Math.random(), // TODO: ID FROM DB
                    name: values.name,
                    description: values.description,
                    status: false,
                });
            })
            .catch(() => {
                message.error("Please fix the errors before saving.");
            });
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
        dataFormModal,
        setDataFormModal,
        isFormModalOpen,
        setIsFormModalOpen,
        handleSubmitModal,
    };
}
