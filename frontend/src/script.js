let currentEditId = null;

// Écouteur d'événements pour le formulaire d'ajout de livre
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut de soumettre le formulaire
    
    // Récupération des valeurs des champs du formulaire
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    
    try {
        // Envoi d'une requête POST pour ajouter un nouveau livre
        const response = await fetch('http://localhost:8000/books/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&year=${encodeURIComponent(year)}`
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        await loadBooks();// Recharge la liste des livres après ajout
        e.target.reset();// Réinitialise le formulaire
    } catch (error) {
        console.error('Error adding book:', error);
        alert('Erreur lors de l\'ajout du livre');
    }
});

// Fonction pour afficher le formulaire d'édition d'un livre
function showEditForm(book) {
    currentEditId = book.id;
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editYear').value = book.year;
    document.getElementById('editModal').style.display = 'block';
}

// Écouteur d'événements pour le formulaire d'édition de livre
document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupère les valeurs des champs du formulaire d'édition
    const title = document.getElementById('editTitle').value;
    const author = document.getElementById('editAuthor').value;
    const year = document.getElementById('editYear').value;
    
    try {
        // Envoie une requête PUT pour mettre à jour le livre
        const response = await fetch(`http://localhost:8000/books/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&year=${encodeURIComponent(year)}`
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        document.getElementById('editModal').style.display = 'none';
        await loadBooks();
    } catch (error) {
        console.error('Error updating book:', error);
        alert('Erreur lors de la modification du livre');
    }
});

// Écouteur d'événements pour fermer la fenêtre modale
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
});

// Ferme la fenêtre modale si l'utilisateur clique en dehors de la fenêtre modale
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


// Fonction pour charger la liste des livres depuis l'API
async function loadBooks() {
    try {
        const response = await fetch('http://localhost:8000/books/');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const books = await response.json();
        
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = '';
        
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-card';
            bookElement.innerHTML = `
                <div>
                    <h3>${escapeHtml(book.title)}</h3>
                    <p>Auteur: ${escapeHtml(book.author)}</p>
                    <p>Année: ${book.year}</p>
                </div>
                <div class="button-group">
                    <button onclick="showEditForm(${JSON.stringify(book).replace(/"/g, '&quot;')})">Modifier</button>
                    <button onclick="deleteBook(${book.id})">Supprimer</button>
                </div>
            `;
            booksList.appendChild(bookElement);
        });
    } catch (error) {
        console.error('Error loading books:', error);
        const booksList = document.getElementById('booksList');
        booksList.innerHTML = '<p>Erreur lors du chargement des livres</p>';
    }
}

// Fonction pour supprimer un livre
async function deleteBook(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
        try {
            const response = await fetch(`http://localhost:8000/books/${id}`, {
                method: 'DELETE'   // Envoie une requête DELETE pour supprimer le livre

            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            await loadBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Erreur lors de la suppression du livre');
        }
    }
}
// Fonction pour sécuriser les données en les échappant afin d'éviter les attaques XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Charge la liste des livres lorsque la page est chargée
document.addEventListener('DOMContentLoaded', loadBooks);