const Settings = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-800">Configuración</h2>
                <p className="text-gray-500 mt-1">Ajusta las preferencias del sistema</p>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">General</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre de la Tienda
                            </label>
                            <input
                                type="text"
                                defaultValue="ZonaGamer"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email de Contacto
                            </label>
                            <input
                                type="email"
                                defaultValue="contacto@zonagamer.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Notificaciones</h3>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Nuevos pedidos</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Stock bajo</span>
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                        </label>
                        <label className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Nuevos usuarios</span>
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                        </label>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Seguridad</h3>
                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                            Cambiar contraseña
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                            Autenticación de dos factores
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
                            Sesiones activas
                        </button>
                    </div>
                </div>

                {/* Appearance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Apariencia</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tema
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option>Claro</option>
                                <option>Oscuro</option>
                                <option>Automático</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Principal
                            </label>
                            <input
                                type="color"
                                defaultValue="#3B82F6"
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default Settings;