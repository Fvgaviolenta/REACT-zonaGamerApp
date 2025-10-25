import { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProductsManagement from '../components/Dashboard/ProductsManagement';
import UsersManagement from '../components/Dashboard/UsersManagement';
import Settings from '../components/Dashboard/Settings';

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState('products');

    const renderSection = () => {
        switch (activeSection) {
            case 'products':
                return <ProductsManagement />;
            default:
                return <ProductsManagement />;
        }
    };

    return (
        <DashboardLayout activeSection={activeSection} setActiveSection={setActiveSection}>
            {renderSection()}
        </DashboardLayout>
    );
};

export default Dashboard;