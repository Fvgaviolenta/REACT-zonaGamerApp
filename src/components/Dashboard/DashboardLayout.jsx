import Sidebar from './Sidebar';

const DashboardLayout = ({ children, activeSection, setActiveSection }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                {/* Main Content */}
                <main className="flex-1 p-8 ml-64">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;