const http = require('http');
const os = require('os');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudScale - Project 2 | Jibrel Abubakr Jibrel</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      color: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    body::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
                  radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
      animation: bgFloat 15s ease-in-out infinite;
    }

    @keyframes bgFloat {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(20px, -20px) rotate(1deg); }
      66% { transform: translate(-15px, 15px) rotate(-1deg); }
    }

    .container {
      position: relative;
      z-index: 1;
      width: 90%;
      max-width: 720px;
    }

    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 48px 40px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08);
      animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25));
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #c4b5fd;
      margin-bottom: 24px;
    }

    .badge .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
      50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
    }

    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #f8fafc 0%, #a78bfa 50%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 1rem;
      color: #94a3b8;
      font-weight: 400;
      margin-bottom: 32px;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), transparent);
      margin: 24px 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 24px;
    }

    .info-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 16px;
      transition: all 0.3s ease;
    }

    .info-item:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(139, 92, 246, 0.3);
      transform: translateY(-2px);
    }

    .info-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #8b5cf6;
      margin-bottom: 6px;
    }

    .info-value {
      font-size: 14px;
      font-weight: 500;
      color: #e2e8f0;
      word-break: break-all;
    }

    .tech-stack {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    .tech-tag {
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: #a5b4fc;
      transition: all 0.2s ease;
    }

    .tech-tag:hover {
      background: rgba(99, 102, 241, 0.2);
      transform: scale(1.05);
    }

    .footer {
      text-align: center;
      margin-top: 24px;
      font-size: 13px;
      color: #64748b;
    }

    @media (max-width: 600px) {
      .card { padding: 32px 24px; }
      h1 { font-size: 1.6rem; }
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="badge">
        <span class="dot"></span>
        Production · Azure ACI
      </div>

      <h1>Jibrel Abubakr Jibrel</h1>
      <p class="subtitle">Student ID: 3932 — CloudScale DevOps · Project 2</p>

      <div class="divider"></div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Hostname</div>
          <div class="info-value">${os.hostname()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Platform</div>
          <div class="info-value">${os.platform()} / ${os.arch()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Node.js</div>
          <div class="info-value">${process.version}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Uptime</div>
          <div class="info-value">${hours}h ${minutes}m ${seconds}s</div>
        </div>
        <div class="info-item">
          <div class="info-label">Memory Usage</div>
          <div class="info-value">${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB</div>
        </div>
        <div class="info-item">
          <div class="info-label">Timestamp</div>
          <div class="info-value">${new Date().toISOString()}</div>
        </div>
      </div>

      <div class="tech-stack">
        <span class="tech-tag">Docker</span>
        <span class="tech-tag">Terraform</span>
        <span class="tech-tag">Azure ACI</span>
        <span class="tech-tag">Node.js</span>
        <span class="tech-tag">GitHub Actions</span>
        <span class="tech-tag">CI/CD</span>
      </div>

      <div class="footer">
        Cloud Computing & DevOps Engineering — Infrastructure as Code
      </div>
    </div>
  </div>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`CloudScale app running at http://localhost:${PORT}/`);
  console.log(`Student: Jibrel Abubakr Jibrel (3932)`);
});
