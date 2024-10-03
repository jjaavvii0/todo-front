import { Alert, Button, Form, Input, Space, Table } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useTableData } from "../hooks/useTableData";
import { DataType } from "../types/types";

export function TodoTable() {
    const initialData: DataType[] = [
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
        { id: 3, name: "Clean the living room", status: false },
    ];
    const defaultFooter = () => (
        <Button
            type="dashed"
            onClick={handleAddNewRow}
        >
            Add new row
        </Button>
    );
    const {
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
    } = useTableData(initialData);

    const columns: TableProps<DataType>["columns"] = [
        //TODO: Use ID as Key, new column with index
        {
            title: "Index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
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
                        onClick={() => handleDeleteRow(record.id)}
                        className="custom-alert"
                        shape="circle"
                        icon={<DeleteOutlined />}
                    />
                </Space>
            ),
        },
    ];

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
                disabled={isDataPending}
                onClick={handleDataToStore}
            >
                Store new data
            </Button>
        </>
    );
}
