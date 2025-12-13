export default function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container py-10 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                    <div>
                        <h3 className="font-semibold mb-4">Loot Kingdom</h3>
                        <p className="text-muted-foreground">
                            Tu destino definitivo para coleccionables de anime y gaming en Argentina.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>Catálogo</li>
                            <li>Términos y Condiciones</li>
                            <li>Contacto</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Social</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>Instagram</li>
                            <li>Twitter</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Loot Kingdom. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
