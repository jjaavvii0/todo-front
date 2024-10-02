import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Input, Space, Table, message } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface DataType {
    id: number;
    name: string;
    description?: string;
    status: boolean;
}
interface EditingState {
    row: number | null;
    column: string; // TODO: Do with ENUM
    data: Partial<DataType>;
}
export function TodoTable() {
    const defaultFooter = () => (
        <Button
            type="dashed"
            onClick={handleAddNewRow}
        >
            Add new row
        </Button>
    );
    const [data, setData] = useState<DataType[]>([
        {
            id: 1,
            name: "Do the technical test",
            description: "Area55",
            status: false,
        },
        {
            id: 2,
            name: "Do the laundry",
            description: "All the T-shirts",
            status: false,
        },
        {
            id: 3,
            name: "Clean the living room",
            status: false,
        },
    ]);
    const [editing, setEditing] = useState<EditingState>({
        row: null,
        column: "",
        data: {},
    });
    const [dataToStore, setDataToStore] = useState(false);
    const dataReference = useRef<DataType[]>(data);

    const [form] = Form.useForm();
    const isEqual = (obj1: object, obj2: object): boolean => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };
    useEffect(() => {
        setDataToStore(isEqual(dataReference.current, data));
    }, [data]);

    const columns: TableProps<DataType>["columns"] = [
        //TODO: Use ID as Key, new column with index
        {
            title: "Index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        // {
        //     title: "ID",
        //     dataIndex: "id",
        //     key: "id",
        // },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (value, record): any =>
                editing.row !== null &&
                record.id === editing.row &&
                editing.column === "name" ? (
                    <Form.Item
                        name={`name_${record.id}`}
                        initialValue={value}
                        rules={[
                            { required: true, message: "Please input a name!" },
                        ]}
                    >
                        <Input
                            autoFocus
                            onChange={(e) =>
                                setEditing({
                                    ...editing,
                                    data: {
                                        ...editing.data,
                                        name: e.target.value,
                                    },
                                })
                            }
                            value={
                                editing.data.name !== undefined
                                    ? editing.data.name
                                    : value
                            }
                            onBlur={() => handleSaveNewData(record.id)}
                        ></Input>
                    </Form.Item>
                ) : (
                    <span
                        onDoubleClick={() =>
                            handleEditingCell(record.id, "name")
                        }
                    >
                        {value}
                    </span>
                ),
        },

        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (value, record): any =>
                editing.row !== null &&
                record.id === editing.row &&
                editing.column === "description" ? (
                    <Form.Item
                        name={`description_${record.id}`}
                        initialValue={value}
                        rules={[
                            {
                                min: 5,
                                message:
                                    "Description must be at least 5 characters long!",
                            },
                        ]}
                    >
                        <Input
                            autoFocus
                            onChange={(e) =>
                                setEditing({
                                    ...editing,
                                    data: {
                                        ...editing.data,
                                        description: e.target.value,
                                    },
                                })
                            }
                            value={
                                editing.data.description !== undefined
                                    ? editing.data.description
                                    : value
                            }
                            onBlur={() => handleSaveNewData(record.id)}
                        ></Input>
                    </Form.Item>
                ) : (
                    <span
                        style={{ color: value ? "inherit" : "grey" }}
                        onDoubleClick={() =>
                            handleEditingCell(record.id, "description")
                        }
                    >
                        {value ? value : "(No description)"}
                    </span>
                ),
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (value, record) => (
                <Alert
                    className="custom-alert"
                    message={value ? "DONE" : "PENDING"}
                    type={value ? "success" : "error"}
                    onClick={() => toggleStatus(record.id)}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (value, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => handleDelete(record.id)}
                        className="custom-alert"
                        shape="circle"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ),
        },
    ];

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
            .then((values) => {
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

    const handleDelete = (id: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
    };
    const handleAddNewRow = () => {
        setData((prevData) => [
            ...prevData,
            {
                id: Math.random(),
                name: "name",
                status: false,
            },
        ]);
    };
    const handleDataToStore = () => {
        setDataToStore(!dataToStore);
        console.log("Sending to server"); //TODO: REQUEST
        dataReference.current = data;
    };

    return (
        <>
            <Form form={form}>
                <Table<DataType>
                    {...{ footer: defaultFooter }}
                    columns={columns}
                    dataSource={data.map((item) => ({ ...item, key: item.id }))}
                />
            </Form>
            <Button
                type="primary"
                disabled={dataToStore}
                onClick={handleDataToStore}
            >
                Store new data
            </Button>
        </>
    );
}
