// ========== قاعدة البيانات ==========
const users = [
    { username: 'student1', password: '123' },
    { username: 'ahmed', password: '456' },
    { username: 'sara', password: '789' }
];

const subjects = [
    { id: 'math', name: 'الرياضيات', icon: 'fa-calculator' },
    { id: 'science', name: 'العلوم', icon: 'fa-flask' },
    { id: 'arabic', name: 'اللغة العربية', icon: 'fa-book-open' }
];

const contentData = {
    math: {
        objective: [
            { type: 'mcq', question: 'ما هو ناتج 5 + 3؟', options: ['5', '8', '10', '15'], correct: 1 },
            { type: 'truefalse', question: 'مجموع زوايا المثلث 180 درجة', answer: true },
            { type: 'image', src: 'images/math/algebra.jpg', caption: 'معادلة جبرية' }
        ],
        essay: [
            { type: 'essay', question: 'اشرح نظرية فيثاغورس مع مثال', modelAnswer: 'نظرية فيثاغورس تنص على أن مربع الوتر يساوي مجموع مربعي الضلعين الآخرين.' }
        ],
        summary: [
            { type: 'text', title: 'ملخص الجبر', content: 'الجبر هو فرع من الرياضيات ...' }
        ]
    },
    science: {
        objective: [
            { type: 'mcq', question: 'ما هو العنصر الأساسي في الماء؟', options: ['هيدروجين وأكسجين', 'كربون', 'نيتروجين', 'كلور'], correct: 0 },
            { type: 'truefalse', question: 'التمثيل الضوئي يحدث في الميتوكوندريا', answer: false }
        ],
        essay: [
            { type: 'essay', question: 'صف دورة حياة النبات', modelAnswer: 'تبدأ بالبذرة، ثم الإنبات...' }
        ]
    },
    arabic: {
        objective: [
            { type: 'mcq', question: 'ما هو جمع كلمة "كتاب"؟', options: ['كتب', 'كاتب', 'مكتبة', 'كتابة'], correct: 0 }
        ],
        summary: [
            { type: 'text', title: 'قواعد الإملاء', content: 'همزة الوصل وهمزة القطع...' }
        ]
    }
};

// ========== دوال مساعدة ==========
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), duration);
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.remove('hidden');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
}

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (isLoggedIn !== 'true' && currentPage !== 'index.html') window.location.href = 'index.html';
    if (isLoggedIn === 'true' && currentPage === 'index.html') window.location.href = 'home.html';
}

function displayUsername() {
    const spans = document.querySelectorAll('#username-display');
    const username = sessionStorage.getItem('username') || 'طالب';
    spans.forEach(span => span.textContent = username);
}

function logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
    showToast('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

// ========== عرض المواد ==========
function renderSubjects(filterType = 'all') {
    const container = document.getElementById('subjects-container');
    if (!container) return;
    container.innerHTML = '';
    subjects.forEach(subject => {
        if (filterType === 'all' || contentData[subject.id]?.[filterType]) {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.dataset.subject = subject.id;
            card.dataset.type = filterType;
            card.innerHTML = `
                <i class="fas ${subject.icon} fa-3x" style="color: var(--primary); margin-bottom: 15px;"></i>
                <h3>${subject.name}</h3>
                <p>اضغط للعرض</p>
            `;
            card.addEventListener('click', () => {
                showLoading();
                setTimeout(() => {
                    window.location.href = `content.html?subject=${subject.id}&type=${filterType}`;
                }, 300);
            });
            container.appendChild(card);
        }
    });
}

// ========== عرض المحتوى ==========
function displayContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    const type = urlParams.get('type');
    if (!subject || !type) { window.location.href = 'home.html'; return; }

    const title = document.getElementById('content-title');
    if (title) {
        const subjectName = subjects.find(s => s.id === subject)?.name || subject;
        const typeName = {
            objective: 'أسئلة موضوعية', essay: 'أسئلة مقالية',
            summary: 'ملخصات', video: 'فيديوهات', exam: 'امتحانات'
        }[type] || type;
        title.textContent = `${subjectName} - ${typeName}`;
    }

    const viewer = document.getElementById('content-viewer');
    if (!viewer) return;
    const items = contentData[subject]?.[type];
    if (!items || items.length === 0) {
        viewer.innerHTML = '<p class="no-content">لا يوجد محتوى في هذا القسم بعد.</p>';
        return;
    }

    viewer.innerHTML = '';
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'content-item';

        switch (item.type) {
            case 'mcq':
                itemDiv.innerHTML = `
                    <div class="question-item">
                        <div class="question-text">${index+1}. ${item.question}</div>
                        <div class="options">
                            ${item.options.map((opt, i) => `
                                <div class="option">
                                    <input type="radio" name="q${index}" id="q${index}opt${i}" value="${i}">
                                    <label for="q${index}opt${i}">${opt}</label>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn-primary check-answer" style="width: auto; padding: 10px 25px;" data-q="${index}" data-correct="${item.correct}">
                            <i class="fas fa-check"></i> تحقق
                        </button>
                        <div class="feedback" id="fb${index}" style="margin-top: 10px;"></div>
                    </div>
                `;
                break;
            case 'truefalse':
                itemDiv.innerHTML = `
                    <div class="question-item">
                        <div class="question-text">${index+1}. ${item.question}</div>
                        <div class="true-false">
                            <label><input type="radio" name="tf${index}" value="true"> <i class="fas fa-check-circle" style="color: var(--success);"></i> صح</label>
                            <label><input type="radio" name="tf${index}" value="false"> <i class="fas fa-times-circle" style="color: var(--error);"></i> خطأ</label>
                        </div>
                        <button class="btn-primary check-tf" style="width: auto; padding: 10px 25px;" data-q="${index}" data-answer="${item.answer}">
                            <i class="fas fa-check"></i> تحقق
                        </button>
                        <div class="feedback" id="fb${index}" style="margin-top: 10px;"></div>
                    </div>
                `;
                break;
            case 'essay':
                itemDiv.innerHTML = `
                    <div class="question-item">
                        <div class="question-text">${index+1}. ${item.question}</div>
                        <textarea rows="4" placeholder="اكتب إجابتك هنا..."></textarea>
                        <details>
                            <summary><i class="fas fa-eye"></i> عرض الإجابة النموذجية</summary>
                            <p>${item.modelAnswer || 'لا توجد إجابة نموذجية'}</p>
                        </details>
                    </div>
                `;
                break;
            case 'image':
                itemDiv.innerHTML = `
                    <div class="image-page">
                        <img src="${item.src}" alt="${item.caption || ''}" style="max-width: 100%; border-radius: 12px; box-shadow: var(--box-shadow);">
                        ${item.caption ? `<p style="margin-top: 10px; color: var(--gray);">${item.caption}</p>` : ''}
                    </div>
                `;
                break;
            case 'text':
                itemDiv.innerHTML = `
                    <div class="text-content">
                        <h3 style="color: var(--primary); margin-bottom: 15px;">${item.title || ''}</h3>
                        <p style="line-height: 1.8;">${item.content}</p>
                    </div>
                `;
                break;
        }
        viewer.appendChild(itemDiv);
    });
    hideLoading();
}

// ========== أحداث ==========
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    displayUsername();

    // تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorDiv = document.getElementById('error-message');
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('username', username);
                showToast('تم تسجيل الدخول بنجاح', 'success');
                setTimeout(() => window.location.href = 'home.html', 1000);
            } else {
                errorDiv.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                showToast('بيانات الدخول غير صحيحة', 'error');
            }
        });
    }

    // أزرار الفلتر
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderSubjects(btn.dataset.type);
            });
        });
        renderSubjects('all');
    }

    // تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // زر الرجوع
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.location.href = 'home.html');
        displayContent();
    }

    // التحقق من الإجابات
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('check-answer')) {
            const btn = e.target;
            const qIndex = btn.dataset.q;
            const correct = parseInt(btn.dataset.correct);
            const selected = document.querySelector(`input[name="q${qIndex}"]:checked`);
            const feedback = document.getElementById(`fb${qIndex}`);
            if (!selected) {
                feedback.innerHTML = '<span style="color: var(--error);"><i class="fas fa-exclamation-circle"></i> يرجى اختيار إجابة أولاً.</span>';
                return;
            }
            const userAnswer = parseInt(selected.value);
            if (userAnswer === correct) {
                feedback.innerHTML = '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> إجابة صحيحة! أحسنت.</span>';
                showToast('إجابة صحيحة!', 'success');
            } else {
                feedback.innerHTML = '<span style="color: var(--error);"><i class="fas fa-times-circle"></i> إجابة خاطئة. حاول مرة أخرى.</span>';
                showToast('إجابة خاطئة', 'error');
            }
        }

        if (e.target.classList.contains('check-tf')) {
            const btn = e.target;
            const qIndex = btn.dataset.q;
            const correct = btn.dataset.answer === 'true';
            const selected = document.querySelector(`input[name="tf${qIndex}"]:checked`);
            const feedback = document.getElementById(`fb${qIndex}`);
            if (!selected) {
                feedback.innerHTML = '<span style="color: var(--error);"><i class="fas fa-exclamation-circle"></i> يرجى اختيار إجابة أولاً.</span>';
                return;
            }
            const userAnswer = selected.value === 'true';
            if (userAnswer === correct) {
                feedback.innerHTML = '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> إجابة صحيحة! أحسنت.</span>';
                showToast('إجابة صحيحة!', 'success');
            } else {
                feedback.innerHTML = '<span style="color: var(--error);"><i class="fas fa-times-circle"></i> إجابة خاطئة. حاول مرة أخرى.</span>';
                showToast('إجابة خاطئة', 'error');
            }
        }
    });
});