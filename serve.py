#!/usr/bin/env python3
"""
Servidor HTTP simple para servir la aplicación web Monitor RCP
Uso: python serve.py
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuración
PORT = 8000
WEB_DIR = "Webpepe"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)
    
    def end_headers(self):
        # Agregar headers CORS para desarrollo
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Log personalizado
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    # Verificar que el directorio web existe
    if not os.path.exists(WEB_DIR):
        print(f"Error: El directorio '{WEB_DIR}' no existe.")
        print("Asegúrate de ejecutar este script desde la raíz del proyecto.")
        sys.exit(1)
    
    # Cambiar al directorio web
    os.chdir(WEB_DIR)
    
    # Crear el servidor
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 Servidor Monitor RCP iniciado")
        print(f"📁 Sirviendo desde: {os.getcwd()}")
        print(f"🌐 URL: http://localhost:{PORT}")
        print(f"🧪 Tests: http://localhost:{PORT}/test.html")
        print(f"📖 Presiona Ctrl+C para detener")
        print("-" * 50)
        
        # Abrir navegador automáticamente
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        # Iniciar servidor
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Servidor detenido")
            httpd.shutdown()

if __name__ == "__main__":
    main()
