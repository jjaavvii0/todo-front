import React from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";

interface DataType {
    id: number;
    name: string;
    description: string;
    status: boolean;
}

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
        // render: (text) => <a>{text}</a>,
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
        render: (value) => (value ? "OK" : "KO"),
        // render: (_, { tags }) => (
        //     <>
        //         {tags.map((tag) => {
        //             let color = tag.length > 5 ? "geekblue" : "green";
        //             if (tag === "loser") {
        //                 color = "volcano";
        //             }
        //             return (
        //                 <Tag
        //                     color={color}
        //                     key={tag}
        //                 >
        //                     {tag.toUpperCase()}
        //                 </Tag>
        //             );
        //         })}
        //     </>
        // ),
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        id: 1,
        name: "John Brown",
        description: "New York No. 1 Lake Park",
        status: true,
    },
    {
        id: 2,
        name: "Jim Green",
        description: "London No. 1 Lake Park",
        status: true,
    },
    {
        id: 3,
        name: "Joe Black",
        description: "Sydney No. 1 Lake Park",
        status: false,
    },
];

export const TodoTable: React.FC = () => (
    <Table<DataType>
        columns={columns}
        dataSource={data}
    />
);
