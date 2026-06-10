// js/dashboard.js
const API_URL = 'https://document-management-api.onrender.com/api';

// Load statistics
async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/documents/stats/overview`);
    const stats = await response.json();

    document.getElementById('totalDocs').textContent = 
      stats.total[0]?.count || 0;

    document.getElementById('totalCategories').textContent = 
      stats.byCategory.length;

    const totalSizeMB = (stats.totalSize[0]?.size || 0) / (1024 * 1024);
    document.getElementById('totalSize').textContent = 
      totalSizeMB.toFixed(2) + ' MB';

    // Populate category filter
    const categoryFilter = document.getElementById('categoryFilter');
    stats.byCategory.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat._id;
      option.textContent = cat._id + ' (' + cat.count + ')';
      categoryFilter.appendChild(option);
    });

  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Load documents
async function loadDocuments(filters = {}) {
  try {
    let url = `${API_URL}/documents/list?`;
    if (filters.search) url += `search=${filters.search}&`;
    if (filters.category) url += `category=${filters.category}&`;

    const response = await fetch(url);
    const documents = await response.json();

    const grid = document.getElementById('documentsList');
    grid.innerHTML = '';

    if (documents.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color:#666;">No documents found. Upload your first document!</p>';
      return;
    }

    documents.forEach(doc => {
      const card = createDocumentCard(doc);
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading documents:', error);
  }
}

// Create document card
function createDocumentCard(doc) {
  const card = document.createElement('div');
  card.className = 'document-card';

  const date = new Date(doc.uploadedAt).toLocaleDateString();

  card.innerHTML = `
    <div class="document-header">
      <div class="document-title">${doc.originalName}</div>
      <div class="document-type">${doc.fileType}</div>
    </div>
    
    <div class="document-meta">
      <span>📅 ${date}</span>
      <span>📄 ${doc.pageCount} pages</span>
    </div>
    
    <div class="document-summary">
      ${doc.summary || 'No summary available'}
    </div>
    
    <div class="document-tags">
      ${doc.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    
    <div class="document-actions">
      <button class="btn-small btn-view" onclick="viewDocument('${doc._id}')">
        View Details
      </button>
      <button class="btn-small btn-delete" onclick="deleteDocument('${doc._id}')">
        Delete
      </button>
    </div>
  `;

  return card;
}

// View document details
function viewDocument(id) {
  window.location.href = `chat.html?docId=${id}`;
}

// Delete document
async function deleteDocument(id) {
  if (!confirm('Are you sure you want to delete this document?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      alert('✅ Document deleted successfully');
      loadDocuments();
      loadStats();
    } else {
      alert('❌ Error: ' + data.error);
    }

  } catch (error) {
    console.error('Delete error:', error);
    alert('❌ Failed to delete document');
  }
}

// Search handler
document.getElementById('searchInput').addEventListener('input', function(e) {
  const search = e.target.value;
  const category = document.getElementById('categoryFilter').value;
  loadDocuments({ search, category });
});

// Category filter handler
document.getElementById('categoryFilter').addEventListener('change', function(e) {
  const category = e.target.value;
  const search = document.getElementById('searchInput').value;
  loadDocuments({ search, category });
});


// Initial load
loadStats();
loadDocuments();
// ... tumhara existing code ...

// Initial load

// 👇 YEH FUNCTION ADD KARO (line 150+ ke aas paas, file ke end mein)
function viewDocument(id) {
  window.location.href = `dashboard.html?id=${id}`;
}
