function startBuilder() {
  const landing = document.getElementById('landingPage');
  const builder = document.getElementById('builderPage');
 
  currentIndex = 0;
  pages.forEach(p => p.classList.remove('active', 'slide-out-left', 'slide-out-right'));
  pages[0].classList.add('active');
  updateProgress();
 
  landing.classList.remove('active-section');
 
  setTimeout(() => {
    builder.classList.add('active-section');
    window.scrollTo(0, 0);
  }, 300);
}

function goHome() {
  const landing = document.getElementById('landingPage');
  const builder = document.getElementById('builderPage');
 
  localStorage.clear();
  currentIndex = 0;
 
  pages.forEach(p => p.classList.remove('active', 'slide-out-left', 'slide-out-right'));
  pages[0].classList.add('active');
 
  document.querySelectorAll('input, textarea, select').forEach(input => {
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = false;
    } else {
      input.value = '';
    }
  });
 
  document.getElementById('workContainer').innerHTML = '';
  document.getElementById('projectsContainer').innerHTML = '';
  document.getElementById('technicalskillsContainer').innerHTML = '';
  document.getElementById('softskillsContainer').innerHTML = '';
  document.getElementById('languagesContainer').innerHTML = '';
 
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
 
  updateProgress();
 
  builder.classList.remove('active-section');
 
  setTimeout(() => {
    landing.classList.add('active-section');
    window.scrollTo(0, 0);
  }, 300);
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key) {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : null;
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const pages = Array.from(document.querySelectorAll(".page"));
let currentIndex = 0;
const progressBar = document.getElementById("progressBar");

function updateProgress() {
  const pct = Math.round(((currentIndex + 1) / pages.length) * 100);
  if (progressBar) progressBar.style.width = pct + "%";
}

function showPage(index, direction = "next") {
  if (index < 0 || index >= pages.length) return;
  if (index === currentIndex) return;

  const old = pages[currentIndex];
  const next = pages[index];

  old.classList.remove("active", "slide-out-left", "slide-out-right");
  next.classList.remove("slide-out-left", "slide-out-right", "active");

  if (direction === "next") old.classList.add("slide-out-left");
  else old.classList.add("slide-out-right");

  next.classList.add("active");

  currentIndex = index;
  updateProgress();

  window.scrollTo(0, 0);
}

function markInvalid(el) {
  if (!el) return;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 500);
}

function pageShake(pageEl) {
  if (!pageEl) return;
  pageEl.classList.add("shake");
  setTimeout(() => pageEl.classList.remove("shake"), 500);
}

function setErrorBelow(el, msg) {
  if (!el) return;
  let err = el.parentElement.querySelector('.error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'error';
    el.parentElement.appendChild(err);
  }
  err.textContent = msg || '';
  if (msg) markInvalid(el);
}

const validators = {
  name(v) {
    if (!v) return 'Full name is required.';
    const words = v.trim().split(/\s+/);
    if (words.length < 2) return 'Please enter at least two names.';
    if (!/^[A-Za-z\u0600-\u06FF\s\-']+$/.test(v)) return 'Name contains invalid characters.';
    return '';
  },
  objective(v) {
    if (!v || v.trim().length < 3) return 'Career title must be at least 3 characters.';
    if (v.trim().length > 50) return 'Career title is too long.';
    return '';
  },
  summary(v) {
    if (!v || v.trim().length < 30) return 'Summary must be at least 30 characters.';
    if (v.trim().length > 1000) return 'Summary too long.';
    return '';
  },
  phone(v) {
    if (!v) return 'Phone is required.';
    const clean = v.replace(/\s+/g,'').replace(/-/g,'');
    if (/^(\+20|20)?1[0-9]{9}$/.test(clean) || /^01[0-9]-\d{4}-\d{4}$/.test(v)) return '';
    return 'Phone must be a valid Egyptian number (e.g., +201012345678 or 010-1234-5678).';
  },
  email(v) {
    if (!v) return 'Email is required.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(v)) return 'Enter a valid email.';
    return '';
  },
  city(v) {
    if (!v) return 'City is required.';
    if (!/^[A-Za-z\u0600-\u06FF0-9 .,\-]+$/.test(v)) return 'City contains invalid characters.';
    return '';
  },
  linkedin(v) {
    if (!v) return '';
    if (!/^https:\/\/(www\.)?linkedin\.com\/.+$/.test(v)) return 'LinkedIn must start with https://www.linkedin.com/';
    if (v.length < 25) return 'LinkedIn URL seems too short.';
    return '';
  },
  portfolio(v) {
    if (!v) return '';
    try {
      const u = new URL(v);
      return (u.protocol === 'http:' || u.protocol === 'https:') ? '' : 'URL must start with http(s)://';
    } catch(e) {
      return 'Enter a valid URL (include https://)';
    }
  },
  university(v) { if (!v) return 'University is required.'; return ''; },
  degree(v) { if (!v) return 'Degree / Major is required.'; return ''; },
  gpa(v) {
    if (!v) return 'GPA is required.';
    if (!/^-?\d+(\.\d+)?$/.test(v)) return "GPA must be a number.";
    const n = parseFloat(v);
    if (n < 0 || n > 4) return 'GPA must be between 0.0 and 4.0';
    return '';
  }
};

function validateCurrentPage() {
  const page = pages[currentIndex];
  let ok = true;

  page.querySelectorAll('.error').forEach(e => e.textContent = '');

  switch (page.id) {
    case 'page1': {
      const nameEl = document.getElementById('fullName');
      const phoneEl = document.getElementById('phone');
      const emailEl = document.getElementById('email');
      const cityEl = document.getElementById('city');

      const e1 = validators.name(nameEl.value.trim());
      const e2 = validators.phone(phoneEl.value.trim());
      const e3 = validators.email(emailEl.value.trim());
      const e4 = validators.city(cityEl.value.trim());

      if (e1) { setErrorBelow(nameEl, e1); ok = false; }
      if (e2) { setErrorBelow(phoneEl, e2); ok = false; }
      if (e3) { setErrorBelow(emailEl, e3); ok = false; }
      if (e4) { setErrorBelow(cityEl, e4); ok = false; }

      if (ok) {
        saveData('personalInfo', {
          fullName: nameEl.value.trim(),
          phone: phoneEl.value.trim(),
          email: emailEl.value.trim(),
          city: cityEl.value.trim()
        });
      } else pageShake(page);
      break;
    }

    case 'page2': {
      const objEl = document.getElementById('careerObjective');
      const sumEl = document.getElementById('professionalSummary');

      const e1 = validators.objective(objEl.value.trim());
      const e2 = validators.summary(sumEl.value.trim());

      if (e1) { setErrorBelow(objEl, e1); ok = false; }
      if (e2) { setErrorBelow(sumEl, e2); ok = false; }

      if (ok) {
        saveData('career', {
          objective: objEl.value.trim(),
          summary: sumEl.value.trim()
        });
      } else pageShake(page);
      break;
    }

    case 'page3': {
      const ln = document.getElementById('linkedin');
      const pf = document.getElementById('portfolio');
      const e1 = validators.linkedin(ln.value.trim());
      const e2 = validators.portfolio(pf.value.trim());
     
      if (e1) { setErrorBelow(ln, e1); ok = false; }
      if (e2) { setErrorBelow(pf, e2); ok = false; }

      if (ok) {
        saveData('links', {
          linkedin: ln.value.trim() || '',
          portfolio: pf.value.trim() || ''
        });
      } else pageShake(page);
      break;
    }

    case 'page4': {
      const uni = document.getElementById('university');
      const deg = document.getElementById('degree');
      const gpa = document.getElementById('gpa');
      const certs = document.getElementById('certificates');
      const uniLocation = document.getElementById('universityLocation');
      
      const eduStartMonth = document.getElementById('eduStartMonth');
      const eduStartYear = document.getElementById('eduStartYear');
      const eduEndMonth = document.getElementById('eduEndMonth');
      const eduEndYear = document.getElementById('eduEndYear');

      const e1 = validators.university(uni.value.trim());
      const e2 = validators.degree(deg.value.trim());
      const e3 = validators.gpa(gpa.value.trim());

      if (e1) { setErrorBelow(uni, e1); ok = false; }
      if (e2) { setErrorBelow(deg, e2); ok = false; }
      if (e3) { setErrorBelow(gpa, e3); ok = false; }

      // ============ NEW: MANDATORY DATE CHECK ============
      // 1. Check if fields are empty
      if (!eduStartMonth.value || !eduStartYear.value) {
        ok = false;
        setErrorBelow(eduStartYear, 'Start date is required.');
      }
      if (!eduEndMonth.value || !eduEndYear.value) {
        ok = false;
        setErrorBelow(eduEndYear, 'End date is required.');
      }

      // 2. Logic Check (Only run if fields are not empty)
      if (ok) {
        const startMonth = eduStartMonth.value;
        const startYear = eduStartYear.value;
        const endMonth = eduEndMonth.value;
        const endYear = eduEndYear.value;
        
        if (endYear === 'Present') {
          // Valid
        } else {
          const months = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
          
          const startYearNum = parseInt(startYear);
          const endYearNum = parseInt(endYear);
          const startMonthNum = months.indexOf(startMonth) + 1;
          const endMonthNum = months.indexOf(endMonth) + 1;

          if (endYearNum < startYearNum) {
            ok = false;
            setErrorBelow(eduEndYear, 'End date cannot be before start date.');
          } else if (endYearNum === startYearNum && endMonthNum < startMonthNum) {
            ok = false;
            setErrorBelow(eduEndYear, 'End date cannot be before start date.');
          }
          // Note: We removed the "same month" check here based on previous advice
        }
      }

      if (ok) {
        // ... (saveData logic remains the same) ...
        let startDate = `${eduStartMonth.value} ${eduStartYear.value}`;
        let endDate = `${eduEndMonth.value} ${eduEndYear.value}`;

        saveData('education', {
          university: uni.value.trim(),
          universityLocation: uniLocation.value.trim(),
          degree: deg.value.trim(),
          gpa: gpa.value.trim(),
          startDate: startDate,
          endDate: endDate,
          certificates: certs.value.trim() || ''
        });
      } else {
        pageShake(page);
      }
      break;
    }

    case 'page5': {
      saveWork();
      const work = loadData('work') || [];
      const workError = document.getElementById('workError');
      if (Array.isArray(work) && work.length > 0 && typeof work[0] !== 'string') {
        const blocks = Array.from(document.querySelectorAll('.work-block'));
        let hasError = false;
        let errorMsg = '';
       
        blocks.forEach(block => {
          const pos = block.querySelector('.pos').value.trim();
          const comp = block.querySelector('.comp').value.trim();
          const fromMonth = block.querySelector('.from-month').value;
          const fromYear = block.querySelector('.from-year').value;
          const toMonth = block.querySelector('.to-month').value;
          const toYear = block.querySelector('.to-year').value;
          const desc = block.querySelector('.desc').value.trim();
         
          if (!pos || !comp || !fromMonth || !fromYear || !toMonth || !toYear || !desc) {
            hasError = true;
            errorMsg = 'Please fill in all fields for each work experience entry.';
            block.style.borderColor = '#ff4444';
            setTimeout(() => { block.style.borderColor = '#ddd'; }, 2000);
          } else {
            if (fromYear === 'Present') {
              hasError = true;
              errorMsg = 'Start date cannot be "Present". Only end date can be "Present".';
              block.style.borderColor = '#ff4444';
              setTimeout(() => { block.style.borderColor = '#ddd'; }, 2000);
            } else {
              if (toYear !== 'Present') {
                const months = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
               
                const fromYearNum = parseInt(fromYear);
                const toYearNum = parseInt(toYear);
                const fromMonthNum = months.indexOf(fromMonth) + 1;
                const toMonthNum = months.indexOf(toMonth) + 1;
               
                if (toYearNum < fromYearNum) {
                  hasError = true;
                  errorMsg = 'End date cannot be before start date.';
                  block.style.borderColor = '#ff4444';
                  setTimeout(() => { block.style.borderColor = '#ddd'; }, 2000);
                } else if (toYearNum === fromYearNum && toMonthNum < fromMonthNum) {
                  hasError = true;
                  errorMsg = 'End date cannot be before start date.';
                  block.style.borderColor = '#ff4444';
                  setTimeout(() => { block.style.borderColor = '#ddd'; }, 2000);
                } else if (toYearNum === fromYearNum && toMonthNum === fromMonthNum) {
                  hasError = true;
                  errorMsg = 'End date cannot be the same as start date.';
                  block.style.borderColor = '#ff4444';
                  setTimeout(() => { block.style.borderColor = '#ddd'; }, 2000);
                }
              }
            }
          }
        });
       
        if (hasError) {
          ok = false;
          workError.textContent = errorMsg;
          markInvalid(workError);
          pageShake(page);
        } else {
          workError.textContent = '';
        }
      } else {
        workError.textContent = '';
      }
      break;
    }

    case 'page6': {
      saveProjects();
      const projects = loadData('projects') || [];
      const projectsError = document.getElementById('projectsError');
      if (Array.isArray(projects) && projects.length > 0 && typeof projects[0] !== 'string') {
        const blocks = Array.from(document.querySelectorAll('.project-block'));
        let hasError = false;
        let errorMsg = '';
       
        blocks.forEach(block => {
          const name = block.querySelector('.proj-name').value.trim();
          const desc = block.querySelector('.proj-desc').value.trim();
         
          if (!name || !desc) {
            hasError = true;
            errorMsg = 'Please fill in project name and description for each project.';
            block.style.borderColor = '#ff4444';
            setTimeout(() => { block.style.borderColor = '#ddd'; }, 2000);
          }
        });
       
        if (hasError) {
          ok = false;
          projectsError.textContent = errorMsg;
          markInvalid(projectsError);
          pageShake(page);
        } else {
          projectsError.textContent = '';
        }
      } else {
        projectsError.textContent = '';
      }
      break;
    }

    case 'page7': {
      // Validate technical skills
      const techSkills = loadData('technicalskills') || [];
      const techSkillsError = document.getElementById('technicalskillsError');
      
      // STRICT CHECK: If empty, or contains the old placeholder, BLOCK IT.
      if (!techSkills || techSkills.length === 0 || (techSkills.length === 1 && techSkills[0] === 'No technical skills added')) {
        ok = false;
        techSkillsError.textContent = 'Please add at least one technical skill.';
        markInvalid(techSkillsError);
      } else {
        techSkillsError.textContent = '';
      }

      // Validate soft skills
      const softSkills = loadData('softSkills') || [];
      const softSkillsError = document.getElementById('softskillsError');
      
      // STRICT CHECK: If empty, or contains the old placeholder, BLOCK IT.
      if (!softSkills || softSkills.length === 0 || (softSkills.length === 1 && softSkills[0] === 'No soft skills added')) {
        ok = false;
        softSkillsError.textContent = 'Please add at least one soft skill.';
        markInvalid(softSkillsError);
      } else {
        softSkillsError.textContent = '';
      }

      if (!ok) {
        pageShake(page);
      }
      break;
    }

    case 'page8': {
      const langs = loadData('languages') || [];
      const languagesError = document.getElementById('languagesError');
      if (!langs || langs.length === 0) {
        saveData('languages', ['No languages added']);
        languagesError.textContent = '';
      } else if (langs.length === 1 && langs[0] === 'No languages added') {
        ok = false;
        languagesError.textContent = 'Please add at least one language before continuing.';
        markInvalid(languagesError);
        pageShake(page);
      } else {
        languagesError.textContent = '';
      }
      break;
    }

    default:
      break;
  }

  updateProgress();
  return ok;
}

document.querySelectorAll(".next").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validateCurrentPage()) {
      const nextId = btn.dataset.next;
      if (!nextId) return;
      const idx = pages.findIndex(p => p.id === nextId);
      if (idx !== -1) showPage(idx, "next");
    }
  });
});

document.querySelectorAll(".back").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const backId = btn.dataset.back;
    if (!backId) return;
    const idx = pages.findIndex(p => p.id === backId);
    if (idx !== -1) showPage(idx, "back");
  });
});

const workContainer = document.getElementById('workContainer');
const addWorkBtn = document.getElementById('addWork');

function generateDateOptions() {
  const currentYear = new Date().getFullYear();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
 
  let monthOptions = '<option value="">Month</option>';
  months.forEach(month => {
    monthOptions += `<option value="${month}">${month}</option>`;
  });
 
  let yearOptions = '<option value="">Year</option>';
  yearOptions += '<option value="Present">Present</option>';
  for (let year = currentYear; year >= 1980; year--) {
    yearOptions += `<option value="${year}">${year}</option>`;
  }
 
  return { monthOptions, yearOptions };
}

function createWorkBlock(data = null) {
  const block = document.createElement('div');
  block.className = 'work-block';
  const { monthOptions, yearOptions } = generateDateOptions();

  block.innerHTML = `
    <div class="form-group"><label>Position</label><input class="pos" type="text" placeholder="e.g., Software Engineer" value="${data ? escapeHtml(data.position) : ''}"></div>
    <div class="form-group"><label>Company</label><input class="comp" type="text" placeholder="e.g., TechCorp" value="${data ? escapeHtml(data.company) : ''}"></div>
    <div class="form-group">
      <label>From</label>
      <div class="date-picker-row">
        <select class="from-month">${monthOptions}</select>
        <select class="from-year">${yearOptions}</select>
      </div>
    </div>
    <div class="form-group">
      <label>To</label>
      <div class="date-picker-row">
        <select class="to-month">${monthOptions}</select>
        <select class="to-year">${yearOptions}</select>
      </div>
    </div>
    <div class="form-group"><label>Description</label><textarea class="desc" placeholder="Describe your responsibilities...">${data ? escapeHtml(data.desc) : ''}</textarea></div>
    <div style="text-align:right"><button class="btn-remove-work">Remove</button></div>
  `;

  workContainer.appendChild(block);
 
  if (data) {
    if (data.fromMonth) block.querySelector('.from-month').value = data.fromMonth;
    if (data.fromYear) block.querySelector('.from-year').value = data.fromYear;
    if (data.toMonth) block.querySelector('.to-month').value = data.toMonth;
    if (data.toYear) block.querySelector('.to-year').value = data.toYear;
  }
}

function saveWork() {
  const blocks = Array.from(document.querySelectorAll('.work-block'));
  if (blocks.length === 0) {
    saveData('work', []);
    return;
  }
  const arr = blocks.map(b => {
    const fromMonth = b.querySelector('.from-month').value;
    const fromYear = b.querySelector('.from-year').value;
    const toMonth = b.querySelector('.to-month').value;
    const toYear = b.querySelector('.to-year').value;
   
    return {
      position: b.querySelector('.pos').value.trim(),
      company: b.querySelector('.comp').value.trim(),
      fromMonth: fromMonth,
      fromYear: fromYear,
      toMonth: toMonth,
      toYear: toYear,
      desc: b.querySelector('.desc').value.trim()
    };
  });
  saveData('work', arr);
}

function loadWorkBlocks() {
  const saved = loadData('work') || [];
  workContainer.innerHTML = '';
  if (saved.length === 1 && typeof saved[0] === 'string') {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = saved[0];
    workContainer.appendChild(note);
    return;
  }
  saved.forEach(w => createWorkBlock(w));
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn-remove-work')) {
    const b = e.target.closest('.work-block');
    if (b) b.remove();
  }
});

if (addWorkBtn) addWorkBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const note = workContainer.querySelector('.muted');
  if (note) note.remove();
  createWorkBlock(null);
});

const projectsContainer = document.getElementById('projectsContainer');
const addProjectBtn = document.getElementById('addProject');

function createProjectBlock(data = null) {
  const block = document.createElement('div');
  block.className = 'project-block';

  block.innerHTML = `
    <div class="form-group"><label>Project Name</label><input class="proj-name" type="text" placeholder="Project name" value="${data ? escapeHtml(data.name) : ''}"></div>
    <div class="form-group"><label>Link</label><input class="proj-link" type="text" placeholder="Project link (optional)" value="${data ? escapeHtml(data.link) : ''}"></div>
    <div class="form-group"><label>Description</label><textarea class="proj-desc" placeholder="Short description">${data ? escapeHtml(data.desc) : ''}</textarea></div>
    <div style="text-align:right"><button class="btn-remove-proj">Remove</button></div>
  `;

  projectsContainer.appendChild(block);
}

function saveProjects() {
  const blocks = Array.from(document.querySelectorAll('.project-block'));
  if (blocks.length === 0) {
    saveData('projects', []);
    return;
  }
  const arr = blocks.map(b => ({
    name: b.querySelector('.proj-name').value.trim(),
    link: b.querySelector('.proj-link').value.trim(),
    desc: b.querySelector('.proj-desc').value.trim()
  }));
  saveData('projects', arr);
}

function loadProjectBlocks() {
  const saved = loadData('projects') || [];
  projectsContainer.innerHTML = '';
  if (saved.length === 1 && typeof saved[0] === 'string') {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = saved[0];
    projectsContainer.appendChild(note);
    return;
  }
  saved.forEach(p => createProjectBlock(p));
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn-remove-proj')) {
    const b = e.target.closest('.project-block');
    if (b) b.remove();
  }
});

if (addProjectBtn) addProjectBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const note = projectsContainer.querySelector('.muted');
  if (note) note.remove();
  createProjectBlock(null);
});

// ==================== TECHNICAL SKILLS FUNCTIONALITY ====================
const technicalskillsContainer = document.getElementById('technicalskillsContainer');
const addtechnicalSkillBtn = document.getElementById('addTechnicalSkill');

function renderTechnicalSkills() {
  if (!technicalskillsContainer) return;

  technicalskillsContainer.innerHTML = '';
  const saved = loadData('technicalskills') || [];
 
  if (!saved || saved.length === 0) {
    return;
  }
 
  if (saved.length === 1 && typeof saved[0] === 'string' && saved[0] === 'No technical skills added') {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = saved[0];
    technicalskillsContainer.appendChild(note);
    return;
  }
 
  saved.forEach((s, idx) => {
    if (s === 'No technical skills added') return;
    const el = document.createElement('span');
    el.className = 'skill-chip';
    el.innerHTML = `${escapeHtml(s)} <button class="remove-chip" data-skill-idx="${idx}"data-skill-type="technical">×</button>`;
    technicalskillsContainer.appendChild(el);
  });
}

// ==================== SOFT SKILLS FUNCTIONALITY ====================
const softskillsContainer = document.getElementById('softskillsContainer');
const addSoftSkillBtn = document.getElementById('addSoftSkill');

function renderSoftSkills() {
  if (!softskillsContainer) return;
  
  softskillsContainer.innerHTML = '';
  const saved = loadData('softSkills') || [];
  if (!saved || saved.length === 0) {
    return;
  }
  if (saved.length === 1 && typeof saved[0] === 'string' && saved[0] === 'No soft skills added') {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = saved[0];
    softskillsContainer.appendChild(note);
    return;
  }
  saved.forEach((s, idx) => {
    if (s === 'No soft skills added') return;
    const el = document.createElement('span');
    el.className = 'skill-chip';
    el.innerHTML = `${escapeHtml(s)} <button class="remove-chip" data-skill-idx="${idx}" data-skill-type="soft">×</button>`;
    softskillsContainer.appendChild(el);
  });
}

document.addEventListener('click', (e) => {
  // Technical skills removal
  if (e.target && e.target.matches('.remove-chip[data-skill-idx][data-skill-type="technical"]')) {
    const idx = parseInt(e.target.dataset.skillIdx);
    let arr = loadData('technicalskills') || [];
    arr.splice(idx, 1);
   
    if (arr.length === 0) {
      saveData('technicalskills', ['No technical skills added']);
    } else {
      saveData('technicalskills', arr);
    }
   
    renderTechnicalSkills();
  }

  // Soft skills removal
  if (e.target && e.target.matches('.remove-chip[data-skill-idx][data-skill-type="soft"]')) {
    const idx = parseInt(e.target.dataset.skillIdx);
    let arr = loadData('softSkills') || [];
    arr.splice(idx, 1);
    if (arr.length === 0) {
      saveData('softSkills', ['No soft skills added']);
    } else {
      saveData('softSkills', arr);
    }
    renderSoftSkills();
  }
});

// Technical skill add button
if (addtechnicalSkillBtn) {
  addtechnicalSkillBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('technicalskillInput');
    if (!input) return;
    const v = input.value.trim();
    if (!v) return;
 
    let arr = loadData('technicalskills') || [];
  
    if (!Array.isArray(arr)) {
      arr = [];
    } else if (arr.length > 0 && typeof arr[0] === 'string' && arr[0] === 'No technical skills added') {
      arr = [];
    }
  
    arr.push(v);
    saveData('technicalskills', arr);
    renderTechnicalSkills();
    input.value = '';
  });
}

// Soft skill add button
if (addSoftSkillBtn) {
  addSoftSkillBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const input = document.getElementById('softskillInput');
    if (!input) return;
    const v = input.value.trim();
    if (!v) return;
    let arr = loadData('softSkills') || [];
    if (!Array.isArray(arr)) {
      arr = [];
    } else if (arr.length > 0 && typeof arr[0] === 'string' && arr[0] === 'No soft skills added') {
      arr = [];
    }
    arr.push(v);
    saveData('softSkills', arr);
    renderSoftSkills();
    input.value = '';
  });
}

// Add Enter key support for skills
if (document.getElementById('technicalskillInput')) {
  document.getElementById('technicalskillInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('addTechnicalSkill').click();
    }
  });
}

if (document.getElementById('softskillInput')) {
  document.getElementById('softskillInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('addSoftSkill').click();
    }
  });
}

// ==================== LANGUAGES FUNCTIONALITY ====================
const languagesContainer = document.getElementById('languagesContainer');
const addLanguageBtn = document.getElementById('addLanguage');

function renderLanguages() {
  if (!languagesContainer) return;
  languagesContainer.innerHTML = '';
  const saved = loadData('languages') || [];
 
  if (!saved || saved.length === 0) {
    return;
  }
 
  if (saved.length === 1 && typeof saved[0] === 'string' && saved[0] === 'No languages added') {
    const note = document.createElement('div');
    note.className = 'muted';
    note.textContent = saved[0];
    languagesContainer.appendChild(note);
    return;
  }
 
  saved.forEach((l, idx) => {
    const block = document.createElement('div');
    block.className = 'lang-block';
    block.innerHTML = `
      <span><b>${escapeHtml(l.name)}</b> - ${escapeHtml(l.level)}</span>
      <button class="btn-remove-lang" data-lang-idx="${idx}">Remove</button>
    `;
    languagesContainer.appendChild(block);
  });
}

document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn-remove-lang')) {
    const idx = parseInt(e.target.dataset.langIdx);
    let arr = loadData('languages') || [];
    arr.splice(idx, 1);
   
    if (arr.length === 0) {
      saveData('languages', ['No languages added']);
    } else {
      saveData('languages', arr);
    }
   
    renderLanguages();
  }
});

if (addLanguageBtn) addLanguageBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const name = document.getElementById('langName').value.trim();
  const level = document.getElementById('langLevel').value;
  if (!name || !level) return;
 
  let arr = loadData('languages') || [];
 
  if (!Array.isArray(arr)) {
    arr = [];
  } else if (arr.length > 0 && typeof arr[0] === 'string' && arr[0] === 'No languages added') {
    arr = [];
  }
 
  arr.push({ name, level });
  saveData('languages', arr);
  renderLanguages();
  document.getElementById('langName').value = '';
  document.getElementById('langLevel').value = '';
});

function populateYearDropdowns() {
  const currentYear = new Date().getFullYear();
  const yearSelectors = [
    'eduStartYear', 'eduEndYear'
  ];
  yearSelectors.forEach(selectorId => {
    const select = document.getElementById(selectorId);
    if (select) {
      const isEndYear = selectorId === 'eduEndYear';
      
      // Clear existing options except the first one
      const firstOption = select.querySelector('option[value=""]');
      const presentOption = isEndYear ? select.querySelector('option[value="Present"]') : null;
      
      select.innerHTML = '';
      
      // Add placeholder option
      select.innerHTML += '<option value="">Year</option>';
      
      // Add "Present" option for end year
      if (isEndYear) {
        select.innerHTML += '<option value="Present">Present</option>';
      }
      
      // Add year options (from current year back to 1980)
      for (let year = currentYear; year >= 1980; year--) {
        select.innerHTML += `<option value="${year}">${year}</option>`;
      }
    }
  });
}

function restoreAll() {
  const p1 = loadData('personalInfo');
  if (p1) {
    if (p1.fullName) document.getElementById('fullName').value = p1.fullName;
    if (p1.phone) document.getElementById('phone').value = p1.phone;
    if (p1.email) document.getElementById('email').value = p1.email;
    if (p1.city) document.getElementById('city').value = p1.city;
  }

  const career = loadData('career');
  if (career) {
    if (career.objective) document.getElementById('careerObjective').value = career.objective;
    if (career.summary) document.getElementById('professionalSummary').value = career.summary;
  }

  const links = loadData('links');
  if (links) {
    if (links.linkedin && links.linkedin !== 'No LinkedIn')
      document.getElementById('linkedin').value = links.linkedin;
    if (links.portfolio && links.portfolio !== 'No Portfolio/Website')
      document.getElementById('portfolio').value = links.portfolio;
  }

  const edu = loadData('education');
  if (edu) {
    if (edu.university) document.getElementById('university').value = edu.university;
    if (edu.universityLocation) document.getElementById('universityLocation').value = edu.universityLocation;
    if (edu.degree) document.getElementById('degree').value = edu.degree;
    if (edu.gpa) document.getElementById('gpa').value = edu.gpa;
    if (edu.certificates && edu.certificates !== 'No Certificates')
      document.getElementById('certificates').value = edu.certificates;

    // Restore education dates
    if (edu.startDate) {
      const [month, year] = edu.startDate.split(' ');
      if (month) {
        const startMonthSelect = document.getElementById('eduStartMonth');
        if (startMonthSelect) startMonthSelect.value = month;
      }
      if (year) {
        const startYearSelect = document.getElementById('eduStartYear');
        if (startYearSelect) startYearSelect.value = year;
      }
    }
    if (edu.endDate) {
      const [month, year] = edu.endDate.split(' ');
      if (month) {
        const endMonthSelect = document.getElementById('eduEndMonth');
        if (endMonthSelect) endMonthSelect.value = month;
      }
      if (year) {
        const endYearSelect = document.getElementById('eduEndYear');
        if (endYearSelect) endYearSelect.value = year;
      }
    }
  }

  loadWorkBlocks();

  loadProjectBlocks();

  renderTechnicalSkills();

  renderSoftSkills();

  renderLanguages();

  populateYearDropdowns();

  updateProgress();

}

function collectCVData() {
  // Get personal info
  const personalInfo = loadData('personalInfo') || {};
  
  //work experience 
  const savedWork = loadData('work') || [];
  let work_experience = [];
  if (!(savedWork.length === 1 && typeof savedWork[0] === 'string')) {
    work_experience = savedWork.map(w => ({
      position: w.position || '',
      company: w.company || '',
      start_date: w.fromMonth && w.fromYear ? `${w.fromMonth} ${w.fromYear}` : '',
      end_date: (w.toYear === 'Present') ? 'Present' : (w.toMonth && w.toYear ? `${w.toMonth} ${w.toYear}` : ''),
      location: '', 
      responsibilities: w.desc ? w.desc.split('\n').filter(r => r.trim()) : []
    }));
  }

  //projects
  const savedProjects = loadData('projects') || [];
  let projects = [];
  if (!(savedProjects.length === 1 && typeof savedProjects[0] === 'string')) {
    projects = savedProjects.map(p => ({
      name: p.name || '',
      description: p.desc || '',
      Project_Link: p.link ? [p.link] : []
    }));
  }

  //languages
  const savedLanguages = loadData('languages') || [];
  let languages = [];
  if (!(savedLanguages.length === 1 && typeof savedLanguages[0] === 'string')) {
    languages = savedLanguages.map(l => ({
      name: l.name || '',
      proficiency: l.level || ''
    }));
  }

  // Get education data
  const educationData = loadData('education') || {};
  const education = [{
    degree: educationData.degree || '',
    institution: educationData.university || '',
    start_date: educationData.startDate || '', 
    end_date: educationData.endDate || '', 
    location: educationData.universityLocation || '', 
    gpa: educationData.gpa || ''
  }];

  // Get technical skills
  const savedTechSkills = loadData('technicalskills') || [];
  let technical_skills = [];
  if (!(savedTechSkills.length === 1 && savedTechSkills[0] === 'No technical skills added')) {
    technical_skills = savedTechSkills.filter(s => s !== 'No technical skills added');
  }

  // Get soft skills
  const savedSoftSkills = loadData('softSkills') || [];
  let soft_skills = [];
  if (!(savedSoftSkills.length === 1 && savedSoftSkills[0] === 'No soft skills added')) {
    soft_skills = savedSoftSkills.filter(s => s !== 'No soft skills added');
  }

  // Get certificates
  const certificates = [];
  const certsText = educationData.certificates || '';
  if (certsText && certsText !== 'No Certificates' && certsText.trim()) {
    certsText.split('\n').forEach(cert => {
      if (cert.trim()) certificates.push(cert.trim());
    });
  }
  // Get links
  const linksData = loadData('links') || {};
  return {
    full_name: personalInfo.fullName || '',
    job_title: loadData('career')?.objective || '',
    email: personalInfo.email || '',
    phone: personalInfo.phone || '',
    city: personalInfo.city || '',
    linkedin: loadData('links')?.linkedin || '',
    portfolio: loadData('links')?.portfolio || '',
    professional_summary: loadData('career')?.summary || '',
    technical_skills: technical_skills,
    soft_skills: soft_skills,
    languages: languages,
    education: education,
    work_experience: work_experience,
    projects: projects,
    certificates: certificates.length > 0 ? certificates : []
  };
}


function openImageModal(src) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  
  modalImg.src = src;
  
  modal.style.display = "flex";
  
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  
  modal.classList.remove('show');
  
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

document.addEventListener('keydown', (e) => {
  if (e.key === "Escape") {
    closeImageModal();
  }
});


let currentZoom = 1;
let isDragging = false;
let startX = 0, startY = 0;
let pointX = 0, pointY = 0;

const minZoom = 0.5;
const maxZoom = 3.5;
const zoomStep = 0.1;

const modalImg = document.getElementById('modalImage');
const modalOverlay = document.getElementById('imageModal');

function updateTransform() {
  modalImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${currentZoom})`;
}

function openImageModal(src) {
  const modal = document.getElementById('imageModal');
  
  currentZoom = 1;
  pointX = 0;
  pointY = 0;
  isDragging = false;
  
  modalImg.style.transform = `translate(0px, 0px) scale(1)`;
  modalImg.src = src;
  
  modal.style.display = "flex";
  setTimeout(() => { modal.classList.add('show'); }, 10);
}

modalOverlay.addEventListener('wheel', function(e) {
  e.preventDefault();

  if (e.deltaY < 0) {
    currentZoom += zoomStep; 
  } else {
    currentZoom -= zoomStep; 
  }

  
  if (currentZoom < minZoom) currentZoom = minZoom;
  if (currentZoom > maxZoom) currentZoom = maxZoom;

  updateTransform();
});


modalImg.addEventListener('mousedown', (e) => {
  e.preventDefault(); 
  isDragging = true;
  
  
  startX = e.clientX - pointX;
  startY = e.clientY - pointY;
});


window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  e.preventDefault();
  
  
  pointX = e.clientX - startX;
  pointY = e.clientY - startY;
  
  updateTransform();
});


window.addEventListener('mouseup', () => {
  isDragging = false;
});


modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay || e.target.classList.contains('close-modal')) {
    closeImageModal();
  }
});


const clearBtn = document.getElementById('clearDataBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      
      document.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
        else input.value = '';
      });
      
      ['workContainer', 'projectsContainer', 'technicalskillsContainer', 'softskillsContainer', 'languagesContainer'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });

      document.querySelectorAll('.error').forEach(e => e.textContent = '');
      
      currentIndex = 0;
      pages.forEach(p => p.classList.remove('active', 'slide-out-left', 'slide-out-right'));
      pages[0].classList.add('active');
      
      updateProgress();
      window.scrollTo(0, 0);
    }
  });
}

//how Success Message
function showSuccessMessage(safeName) {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingContent = document.querySelector('.loading-content');
  // Create success message HTML
  loadingContent.innerHTML = `
    <div class="success-icon">✓</div>
    <h3 class="success-message">
      Your CV has been downloaded successfully!
    </h3>
    <p class="success-details">
      File: <strong>${safeName}_CV.json</strong>
    </p>
    <p class="success-note">
      Your CV data will now be cleared for privacy.
    </p>
    <button id="successOkBtn" class="btn-primary success-btn">
      OK
    </button>
  `;
  // Add event listener to OK button
  document.getElementById('successOkBtn').addEventListener('click', function() {
    // Clear all localStorage data
    localStorage.clear();
    
    // Reset all form fields
    document.querySelectorAll('input, textarea, select').forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
    // Clear dynamic containers
    document.getElementById('workContainer').innerHTML = '';
    document.getElementById('projectsContainer').innerHTML = '';
    document.getElementById('technicalskillsContainer').innerHTML = '';
    document.getElementById('softskillsContainer').innerHTML = '';
    document.getElementById('languagesContainer').innerHTML = '';

    // Clear errors
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
    
    // Reset to first page
    currentIndex = 0;
    pages.forEach(p => p.classList.remove('active', 'slide-out-left', 'slide-out-right'));
    pages[0].classList.add('active');
    updateProgress();

    // Hide loading overlay
    loadingOverlay.classList.remove('active');
    
    // Return to home page
    const landing = document.getElementById('landingPage');
    const builder = document.getElementById('builderPage');
    builder.classList.remove('active-section');
    
    setTimeout(() => {
      landing.classList.add('active-section');
      window.scrollTo(0, 0);
      
      // Reset loading content to original state for next use
      resetLoadingContent();
    }, 300);
  });
}


//Reset Loading Content
function resetLoadingContent() {
  const loadingContent = document.querySelector('.loading-content');
  loadingContent.innerHTML = `
    <img 
      src="https://api.dicebear.com/9.x/avataaars/svg?seed=Abdo&backgroundColor=b6e3f4&mouth=smile&eyebrows=default" 
      alt="Smiling Avatar" 
      class="loading-avatar"
    >
    
    <h3 class="loading-message">
      Let’s create a resume for the<br>
      <span class="highlight-text" id="loadingJobTitle">Awesome Professional</span><br>
      in you!
    </h3>

    <div class="loading-bar-container">
      <div class="loading-bar-fill"></div>
    </div>
  `;
}


document.getElementById('submitBtn').addEventListener('click', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const jobTitleSpan = document.getElementById('loadingJobTitle');
  const loadingBar = document.querySelector('.loading-bar-fill');

  // --- 1. Validation Logic ---
  let allValid = true;
  const originalIndex = currentIndex;

  for (let i = 0; i < pages.length - 1; i++) {
    currentIndex = i;
    if (!validateCurrentPage()) {
      allValid = false;
      showPage(i);
      break;
    }
  }
  currentIndex = originalIndex;
  showPage(pages.length - 1);
  
  if (!allValid) {
    alert('Please fix all errors before submitting.');
    return;
  }

  // Loading Screen
  const careerData = loadData('career');
  let userJob = "Professional";
  if (careerData && careerData.objective) {
    userJob = careerData.objective.trim();
  }
  jobTitleSpan.textContent = `Awesome ${userJob}`;

  loadingOverlay.classList.add('active');
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  //SMOOTH PROGRESS
  let currentProgress = 5;
  if (loadingBar) loadingBar.style.width = '5%';

  const progressTimer = setInterval(() => {
    if (currentProgress < 90) {
      currentProgress += Math.random() * 5;
      if (loadingBar) loadingBar.style.width = `${currentProgress}%`;
    }
  }, 800);

  try {
    const finalData = collectCVData();
    console.log('Sending data to backend:', finalData);
    
    // Send to backend API
    const response = await fetch('http://localhost:5000/api/process-cv',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalData)
    });
    
    clearInterval(progressTimer); 

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    if (loadingBar) loadingBar.style.width = '100%';

    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'Enhanced_CV.docx';

    if (contentDisposition) {
      // Try to match filename="name.docx" OR filename=name.docx
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    setTimeout(() => {
      showSuccessMessage(filename.replace('.docx', ''));
    }, 1000);
    
  } catch (error) {
    // Stop the timer if an error occurs
    clearInterval(progressTimer);
    console.error('Error:', error);
    loadingOverlay.classList.remove('active');
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit CV";
    alert('Error: ' + error.message);
  }
});
  

document.addEventListener('DOMContentLoaded', function() {
    // Populate year dropdowns on page load
    populateYearDropdowns();
  
    // Restore saved data if any
    restoreAll();
  });
    