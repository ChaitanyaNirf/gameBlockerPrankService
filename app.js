const express = require('express');
const { exec } = require('child_process');
const Service = require('node-windows').Service;
const app = express();
const PORT = 3000; 

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || 'test';

app.use(express.json());

//Even though it's a prank, we should ensure that only you can access the API
//so implemented basic authentication
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).set('WWW-Authenticate', 'Basic realm="GameBlocker"').send('Unauthorized');
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8').split(':');
    const [username, password] = credentials;
    
    if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASS) {
        return res.status(403).send('Forbidden: Invalid Credentials');
    }
    next();
};

//get list of all running processes
app.get('/processes', authenticate, (req, res) => {
    exec('tasklist', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send(stdout);
    });
});

//use a post API to close the processes
//can use GET with query params as well but let's stick to POST for now
app.post('/shutdown', authenticate, (req, res) => {
    const { processes } = req.body;
    if (!Array.isArray(processes) || processes.length === 0) {
        return res.status(400).send('Provide a list of process names to close.');
    }
    
    let killCommands = processes.map(proc => `taskkill /F /IM ${proc}`).join(' & ');
    
    exec(killCommands, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send(`Closed specified processes: ${stdout}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//to install the app as a service
if (process.argv.includes('--install')) {
    const svc = new Service({
        name: 'GameBlockerService',
        description: 'Node.js service to manage running processes',
        script: __filename,
        nodeOptions: ['--harmony', '--max_old_space_size=4096']
    });

    svc.on('install', () => {
        svc.start();
        console.log('Service installed and started.');
    });

    svc.install();
}
