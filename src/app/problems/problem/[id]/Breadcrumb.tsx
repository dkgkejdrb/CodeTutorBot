import './Breadcrumb.css';
import { Breadcrumb } from 'antd';
import { ReactNode } from 'react';

export interface ItemType {
    href?: string;
    title: ReactNode;
}

interface BreadItemProps {
    items: ItemType[];
}

const Home: React.FC<BreadItemProps> = ({ items }) => {
    return (
        <div className='breadcrumbWrapper' style={{ backgroundColor: "#272753", width: "100%", height: 48, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className='container'>
                <Breadcrumb items={items} style={{ fontSize: 14 }} />
            </div>
        </div>
    );
}

export default Home;