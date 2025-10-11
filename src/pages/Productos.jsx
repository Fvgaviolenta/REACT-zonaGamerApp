function Productos() {
    return (
        <>
                                <main className="my-5" id="productos-section">
                    <div className="categorias-container">
                        <h2 className="categorias-titulo">Categorías</h2>
                        <div className="categorias-box">
                            <ul className="categorias-lista">
                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseOne" aria-expanded="false"
                                                aria-controls="flush-collapseOne">
                                                Hardware
                                            </button>
                                        </h2>
                                        <div id="flush-collapseOne" className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">
                                                <li><a href="#">CPU</a></li>
                                                <li><a href="#">GPU</a></li>
                                                <li><a href="#">Motherboard</a></li>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                                data-bs-target="#flush-collapseTwo" aria-expanded="false"
                                                aria-controls="flush-collapseTwo">
                                                Perifericos
                                            </button>
                                        </h2>
                                        <div id="flush-collapseTwo" className="accordion-collapse collapse"
                                            data-bs-parent="#accordionFlushExample">
                                            <div className="accordion-body">
                                                <li><a href="#">Teclados</a></li>
                                                <li><a href="#">Mouse</a></li>
                                                <li><a href="#">Monitores</a></li>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="productos-container">
                        <div className="titulo">
                            <h1 className="mb-4">Productos</h1>
                        </div>

                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            <div className="col">
                                <a href="#" target="_blank" className="card-link-wrapper">
                                    <div className="card h-100">
                                        <img src="https://www.winpy.cl/files/38856-1725-RTX-4070-TI-SUPER-16G-VENTUS-3X-1.jpg"
                                            className="card-img-top" alt="..."/>
                                            <div className="card-body">
                                                <h5 className="card-title">Nvidia GeForce RTX4070ti SUPER</h5>
                                                <p className="card-text">$3.225.225</p>
                                            </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col">
                                <a href="#" target="_blank" className="card-link-wrapper">
                                    <div className="card h-100">
                                        <img src="https://i.bolder.run/r/czozMjIxLGc6NjkweA/2d37a7fc/736207-Kumara1.png"
                                            className="card-img-top" alt="..."/>
                                            <div className="card-body">
                                                <h5 className="card-title">Redragon Kumara K552 RGB</h5>
                                                <p className="card-text">
                                                    Teclado mecánico compacto, switches blue, retroiluminación RGB. $43.000
                                                </p>
                                            </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col">
                                <a href="#" target="_blank" className="card-link-wrapper">
                                    <div className="card h-100">
                                        <img src="https://gsmpro.cl/cdn/shop/files/procesador-intel-core-i7-12700kf.jpg?v=1747340810&width=900"
                                            className="card-img-top" alt="..."/>
                                            <div className="card-body">
                                                <h5 className="card-title">Intel Core i7-12700KF</h5>
                                                <p className="card-text">
                                                    Procesador de 12ª generación, 12 núcleos, hasta 5.0 GHz. $789.903
                                                </p>
                                            </div>
                                    </div>
                                </a>
                            </div>

                            <div className="col">
                                <a href="#" target="_blank" className="card-link-wrapper">
                                    <div className="card h-100">
                                        <img src="https://media.spdigital.cl/thumbnails/products/tmp_1ggc33p_21eb8266_thumbnail_4096.jpg"
                                            className="card-img-top" alt="..."/>
                                            <div className="card-body">
                                                <h5 className="card-title">Notebook Gamer HP OMEN</h5>
                                                <p className="card-text">Notebook moderno y versátil. $899.890</p>
                                            </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
        </>
    )
}

export default Productos;