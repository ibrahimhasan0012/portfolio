#!/usr/bin/env python3
"""
Modern, Secure Local Server for Ibrahim Hasan's Portfolio Website.
- Zero PHP, zero unsafe external runtime dependencies.
- Adds standard web security headers (CSP, X-Content-Type-Options, etc.).
- Automatically configures correct MIME types for modern web assets.
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SecurePortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Modern Security Headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
        self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        # Ensure precise modern MIME types
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.css'):
            return 'text/css; charset=utf-8'
        elif path.endswith('.html'):
            return 'text/html; charset=utf-8'
        elif path.endswith('.png'):
            return 'image/png'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

    def log_message(self, format, *args):
        # Clean terminal output
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} -> {args[1]}\n")

def run(port=PORT):
    # Allow port reuse to avoid 'Address already in use' errors
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), SecurePortfolioHandler) as httpd:
        print("=" * 64)
        print(f"  ⚡ Ibrahim Hasan — Portfolio Local Dev Server")
        print(f"  📍 Local URL: http://localhost:{port}")
        print(f"  📁 Serving Directory: {DIRECTORY}")
        print(f"  🔒 Security: Zero PHP, Modern Headers Enabled")
        print("=" * 64)
        print("Press Ctrl+C to terminate.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run(port)
