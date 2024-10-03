import { Form, FormInstance, Input, Modal } from "antd";
import { DataType } from "../../types/types";

interface ModalProps {
    isFormModalOpen: boolean;
    handleSubmitModal: () => void;
    setIsFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDataFormModal: React.Dispatch<React.SetStateAction<Partial<DataType>>>;
    dataFormModal: Partial<DataType>;
    form: FormInstance;
}
export const ModalForm = ({
    isFormModalOpen,
    handleSubmitModal,
    setIsFormModalOpen,
    setDataFormModal,
    dataFormModal,
    form,
}: ModalProps) => {
    return (
        <>
            <Modal
                title="New row"
                centered
                open={isFormModalOpen}
                onOk={handleSubmitModal}
                onCancel={() => setIsFormModalOpen(false)}
            >
                <Form form={form}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            { required: true, message: "Please input a name!" },
                        ]}
                    >
                        <Input
                            onChange={(e) =>
                                setDataFormModal((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            value={dataFormModal.name ?? ""}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                min: 5,
                                message:
                                    "Description must be at least 5 characters long!",
                            },
                        ]}
                    >
                        <Input
                            onChange={(e) =>
                                setDataFormModal((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            value={dataFormModal.description ?? ""}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
