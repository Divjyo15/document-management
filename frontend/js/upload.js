// js/upload.js
// NOTE: API_URL dashboard.js mein define hai, isliye yahan nahi likhna

// File input handler
document.getElementById('documentFile').addEventListener('change', function(e) {
  const fileName = e.target.files[0]?.name || 'Choose file';
  document.getElementById('fileName').textContent = fileName;
});

// Upload form handler
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('documentFile');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('document', file);
  formData.append('uploadedBy', 'Admin');

  const uploadBtn = document.getElementById('uploadBtn');
  const progressBar = document.getElementById('uploadProgress');

  try {
    // Show progress
    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Processing...';
    progressBar.style.display = 'block';

    const response = await fetch(`${API_URL}/documents/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      alert(`✅ Document uploaded successfully!\n\nCategory: ${data.document.category}\nTags: ${data.document.tags.join(', ')}`);

      // Reset form
      fileInput.value = '';
      document.getElementById('fileName').textContent = 'Choose file';

      // Reload documents list
      loadDocuments();
      loadStats();
    } else {
      alert('❌ Error: ' + data.error);
    }

  } catch (error) {
    console.error('Upload error:', error);
    alert('❌ Upload failed: ' + error.message);
  } finally {
    uploadBtn.disabled = false;
    uploadBtn.textContent = 'Upload & Analyze';
    progressBar.style.display = 'none';
  }
});
