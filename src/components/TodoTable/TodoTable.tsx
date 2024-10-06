import { Alert, Button, Form, Input, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useTableData } from "../../hooks/useTodoTable";
import { DataType } from "../../types/types";
import { ModalForm } from "./ModalForm";

export function TodoTable() {
    const defaultFooter = () => (
        <Button
            type="dashed"
            onClick={() => setIsFormModalOpen((prev) => !prev)}
        >
            Add new row
        </Button>
    );

    const {
        data,
        editing,
        toggleStatus,
        handleEditingCell,
        handleSaveNewData,
        handleDeleteRow,
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
    } = useTableData();

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
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Store row">
                        <Button
                            onClick={() => handleUpdateRow(record)}
                            className="custom-alert"
                            disabled={checkIfRowModified(record.id)}
                            icon={<SaveOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Delete row">
                        <Button
                            onClick={() => handleDeleteRow(record.id)}
                            className="custom-alert"
                            style={{ marginRight: "8px" }}
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <ModalForm
                isFormModalOpen={isFormModalOpen}
                handleSubmitModal={handleSubmitModal}
                setDataFormModal={setDataFormModal}
                dataFormModal={dataFormModal}
                form={form}
                handleCancelModal={handleCancelModal}
            />
            <Form form={form}>
                <Table<DataType>
                    {...{ footer: defaultFooter }}
                    columns={columns}
                    dataSource={data.map((item) => ({ ...item, key: item.id }))}
                />
            </Form>
        </>
    );
}
