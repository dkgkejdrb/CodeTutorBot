import '@/app/components/Breadcrumb.css'
import { Breadcrumb } from 'antd';
import { ReactNode } from 'react';

export interface ItemType {
    href?: string;
    title: ReactNode;
}

interface BreadItemProps {
    items: ItemType[];
}

const styleProps = {
    fontSize: 22, fontWeight: "bold", color: "#666", marginTop: 8
}

const Home: React.FC<BreadItemProps> = ({ items }) => {
    return (
        <div className='breadcrumbBar'>
            <div className='container'>
                <Breadcrumb items={items} style={styleProps} />
            </div>
        </div>
    );
}

export default Home;