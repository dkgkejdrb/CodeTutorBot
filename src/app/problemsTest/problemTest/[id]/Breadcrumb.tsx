import './Breadcrumb.css';
import { Breadcrumb } from 'antd';
import { ReactNode } from 'react';

export interface ItemType {
    href?: string;
    title: ReactNode;
}

interface BreadItemProps {
    items: ItemType[];
    afterItem?: string | undefined; // optional 타입으로
}

const Home: React.FC<BreadItemProps> = ({ items, afterItem }) => {
    return (
        <div className='breadcrumbWrapper' style={{ backgroundColor: "#272753", width: "100%", height: 48, display: "flex", alignItems: "center" }}>
            <div className='container' style={{ marginLeft: 15, display: "flex" }}>
                <Breadcrumb items={items} style={{ fontSize: 14 }} />
                <div style={{ margin: "0px 5px", color: "white"}}>/</div>
                <div style={{ color: "white", fontWeight: "bold" }}>{afterItem}</div>
            </div>
        </div>
    );
}

export default Home;