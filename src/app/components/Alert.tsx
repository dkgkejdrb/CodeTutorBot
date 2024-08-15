'use client'

import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

export interface resProp {
    type: string | undefined,
    message: string | undefined,
    modalOpen: boolean | undefined
}

function Alert({ type, message, modalOpen }: resProp) {
    const [isModalOpen, setIsModalOpen] = useState(modalOpen);

    const router = useRouter();

    const handleOk = () => {
        setIsModalOpen(false);
        router.push('/');
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal title={type} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>{message}</p>
        </Modal>
    );
}

export default Alert;