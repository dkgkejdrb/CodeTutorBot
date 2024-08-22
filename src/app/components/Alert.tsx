'use client'

import { Modal } from "antd";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export interface resProp {
    title: string | undefined,
    type: string | undefined,
    message: string | undefined,
    modalOpen: boolean | undefined,
    url: string
}

function Alert({ title, type, message, modalOpen, url }: resProp) {
    const [isModalOpen, setIsModalOpen] = useState(modalOpen);
    
    const router = useRouter();

    const handleOk = () => {
        // 회원가입 성공했다면, /login 페이지로 이동
        if (type === 'success') {
            setIsModalOpen(false);
            router.push(url);
        }
        if (type === 'error') {
            setIsModalOpen(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal closable={false} title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelButtonProps={{ style: { display: 'none'} }}>
            <p>{message}</p>
        </Modal>
    );
}

export default Alert;