// =============================================
//   WISDOM School ID Card Generator — script.js
// =============================================

// --- Photo Upload ---
document.getElementById('photoInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    const wrap = document.getElementById('photoWrap');
    wrap.innerHTML = `<img src="${ev.target.result}" alt="Student Photo">`;
    document.getElementById('photoUploadArea').querySelector('.upload-icon').textContent = '✅';
  };
  reader.readAsDataURL(file);
});





// --- Live Field Mapping (input id → card element id) ---
const liveMap = {
  studentName: 'cardName',
  grade: 'cardGrade',
  fatherName: 'cardFather',
  dob: 'cardDob',
  contact: 'cardContact',
  address: 'cardAddress'
};

Object.keys(liveMap).forEach(inputId => {
  document.getElementById(inputId).addEventListener('input', function () {
    const targets = Array.isArray(liveMap[inputId]) ? liveMap[inputId] : [liveMap[inputId]];
    targets.forEach(t => {
      document.getElementById(t).textContent = this.value;
    });
  });
});

// --- Generate Card Button ---
function generateCard() {
  // Trigger all live field updates
  Object.keys(liveMap).forEach(inputId => {
    const el = document.getElementById(inputId);
    el.dispatchEvent(new Event('input'));
  });

  // Flash animation on card
  const card = document.getElementById('idCard');
  card.style.transform = 'scale(1.04)';
  card.style.transition = 'transform 0.25s ease, box-shadow 0.25s ease';
  card.style.boxShadow = '0 20px 60px rgba(0,150,136,0.35)';
  setTimeout(() => {
    card.style.transform = 'scale(1)';
    card.style.boxShadow = '0 12px 50px rgba(0,0,0,0.22)';
  }, 280);
}

// --- Download Image Button ---
function downloadImage() {
  const card = document.getElementById('idCard');
  const originalTransform = card.style.transform;
  const originalTransition = card.style.transition;
  const originalBoxShadow = card.style.boxShadow;

  // Temporarily remove shadow and transform before capturing so it looks perfect
  card.style.transform = 'none';
  card.style.transition = 'none';
  card.style.boxShadow = 'none';

  html2canvas(card, {
    scale: 4, // High resolution (approx 384dpi)
    useCORS: true,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    // Restore original styles
    card.style.transform = originalTransform;
    card.style.transition = originalTransition;
    card.style.boxShadow = originalBoxShadow;

    // Create download link
    const link = document.createElement('a');
    let studentName = document.getElementById('studentName').value.trim();
    if (!studentName) studentName = 'Student';
    // Remove invalid filename characters
    studentName = studentName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    
    link.download = studentName + '_ID_Card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error("Error downloading image: ", err);
    alert("Image download failed. Make sure all images have loaded correctly.");
    card.style.transform = originalTransform;
    card.style.transition = originalTransition;
    card.style.boxShadow = originalBoxShadow;
  });
}
