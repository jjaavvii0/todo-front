import { useState } from "react";
import { Alert, Button, Input, Space, Table } from "antd";
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
    column: string; // TODO: Hacer un ENUM
    data: Partial<DataType>;
}
export function TodoTable() {
    const [editing, setEditing] = useState<EditingState>({
        row: null,
        column: "",
        data: {},
    });

    const columns: TableProps<DataType>["columns"] = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            //RENDER:
            //Primer parámetro representa el valor de la celda para esa columna particular
            //Segundo parámetro es el objeto que representa toda la fila
            render: (value, record): any =>
                editing.row !== null &&
                record.id === editing.row &&
                editing.column === "name" ? (
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
                ) : (
                    <span onDoubleClick={() => handleEditingCell(record.id, "name")}>
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
            render: (value, record) =>
                value ? (
                    <Alert
                        className="custom-alert"
                        message="DONE"
                        type="success"
                        onClick={() => toggleStatus(record.id)}
                    />
                ) : (
                    <Alert
                        className="custom-alert"
                        message="PENDING"
                        type="error"
                        onClick={() => toggleStatus(record.id)}
                    />
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Space size="middle">
                    <Button
                        className="custom-alert"
                        shape="circle"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ),
        },
    ];

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

    const toggleStatus = (id: number) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, status: !item.status } : item
            )
        );
    };

    const handleEditingCell = (id: number, column: string) => {
        setEditing({...editing, column:column, row:id});
    };

    const handleSaveNewData = (id: number) => {
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
    };

    return (
        <Table<DataType>
            columns={columns}
            dataSource={data}
        />
    );
}
