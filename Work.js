
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
app.use(bodyParser.json());

// Configuration de la connexion MySQL Question 1
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Ulyssemysql32!', 
    database: 'my_database' 
});


db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        process.exit(1);
    }
    console.log('Connecté à la base de données MySQL');
});

// End of Question 1

app.get('/add', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Enregistrement ajouté avec succès');
    });
});


app.get('/records', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


app.get('/record/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Enregistrement non trouvé');
        res.json(result[0]);
    });
});


app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(query, [name, email, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Enregistrement non trouvé');
        res.send('Enregistrement mis à jour avec succès');
    });
});


app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) return res.status(404).send('Enregistrement non trouvé');
        res.send('Enregistrement supprimé avec succès');
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
