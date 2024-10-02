import { useState } from "react";
import { Alert, Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface DataType {
    id: number;
    name: string;
    description?: string;
    status: boolean;
}

export function TodoTable() {
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
        },

        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (value, info) =>
                value ? (
                    <Alert
                        className="custom-alert"
                        message="DONE"
                        type="success"
                        onClick={() => toggleStatus(info.id)}
                    />
                ) : (
                    <Alert
                        className="custom-alert"
                        message="PENDING"
                        type="error"
                        onClick={() => toggleStatus(info.id)}
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

    return (
        <Table<DataType>
            columns={columns}
            dataSource={data}

        />
    );
}
