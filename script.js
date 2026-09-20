
// ============================================================
// LẤY CÁC PHẦN TỬ DOM
// ============================================================

const a1Input = document.getElementById('a1');
const b1Input = document.getElementById('b1');
const c1Input = document.getElementById('c1');
const op1Select = document.getElementById('op1');

const a2Input = document.getElementById('a2');
const b2Input = document.getElementById('b2');
const c2Input = document.getElementById('c2');
const op2Select = document.getElementById('op2');

const preview1 = document.getElementById('preview1');
const preview2 = document.getElementById('preview2');

const solveBtn = document.getElementById('solveBtn');
const resetBtn = document.getElementById('resetBtn');
const resultBox = document.getElementById('result');

// ============================================================
// CẤU HÌNH VIDEO BÍ MẬT
// ============================================================

// File huma.mp4 nằm cùng thư mục với index.html
const VIDEO_URL = './huma.mp4';

// ============================================================
// KIỂM TRA MÃ BÍ MẬT
// ============================================================

function checkEasterEgg(a1, b1, c1, op1, a2, b2, c2, op2) {
    return (
        a1 === 18 &&
        b1 === 12 &&
        c1 === 2012 &&
        op1 === '+' &&
        a2 === 1 &&
        b2 === 1 &&
        c2 === 5 &&
        op2 === '+'
    );
}

// ============================================================
// HÀM TIỆN ÍCH
// ============================================================

function opSymbol(op) {
    return {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    }[op] || op;
}

function formatNumber(n) {
    if (!Number.isFinite(n)) return '∞';

    const rounded = Math.round(n * 1e6) / 1e6;

    return rounded.toString();
}

// ============================================================
// CẬP NHẬT PREVIEW
// ============================================================

function updatePreview() {
    const a1 = a1Input.value || '?';
    const b1 = b1Input.value || '?';
    const c1 = c1Input.value || '?';

    const a2 = a2Input.value || '?';
    const b2 = b2Input.value || '?';
    const c2 = c2Input.value || '?';

    preview1.textContent =
        `${a1}x ${opSymbol(op1Select.value)} ${b1}y = ${c1}`;

    preview2.textContent =
        `${a2}x ${opSymbol(op2Select.value)} ${b2}y = ${c2}`;
}

// ============================================================
// HIỂN THỊ KẾT QUẢ
// ============================================================

function showResult(html, type = 'info') {
    resultBox.className = 'result show ' + type;
    resultBox.innerHTML = html;
}

function clearResult() {
    resultBox.className = 'result';
    resultBox.innerHTML = '';
}

// ============================================================
// PHÁT VIDEO TRÊN CHÍNH TRANG WEB
// ============================================================

function playSecretVideo() {
    // Xóa trình phát cũ nếu đang tồn tại
    const oldOverlay = document.getElementById('secretVideoOverlay');

    if (oldOverlay) {
        const oldVideo = oldOverlay.querySelector('video');

        if (oldVideo) {
            oldVideo.pause();
            oldVideo.removeAttribute('src');
            oldVideo.load();
        }

        oldOverlay.remove();
    }

    // Tạo lớp phủ video
    const overlay = document.createElement('div');
    overlay.id = 'secretVideoOverlay';

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.96);
        z-index: 999999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px;
        box-sizing: border-box;
    `;

    // Tiêu đề video
    const title = document.createElement('div');

    title.textContent = '🎬 Video bí mật';

    title.style.cssText = `
        color: white;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 18px;
        text-align: center;
    `;

    // Tạo trình phát video
    const video = document.createElement('video');

    video.src = VIDEO_URL;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;

    // Để tắt tiếng ban đầu giúp trình duyệt dễ cho phép tự phát
    video.muted = true;

    video.style.cssText = `
        display: block;
        width: 100%;
        max-width: 900px;
        max-height: 70vh;
        background: #000;
        border-radius: 12px;
        object-fit: contain;
    `;

    // Thông báo lỗi tải video
    const errorMessage = document.createElement('p');

    errorMessage.textContent =
        'Không thể tải video. Hãy kiểm tra file huma.mp4 trên GitHub.';

    errorMessage.style.cssText = `
        display: none;
        color: #ff6b6b;
        text-align: center;
        margin-top: 12px;
    `;

    video.addEventListener('error', () => {
        errorMessage.style.display = 'block';
    });

    // Nút đóng video
    const closeBtn = document.createElement('button');

    closeBtn.type = 'button';
    closeBtn.textContent = '✖ Đóng video';

    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 12px 26px;
        border: none;
        border-radius: 10px;
        background: #e11d48;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
    `;

    closeBtn.addEventListener('click', () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
        overlay.remove();
    });

    // Ghép các phần tử
    overlay.appendChild(title);
    overlay.appendChild(video);
    overlay.appendChild(errorMessage);
    overlay.appendChild(closeBtn);

    document.body.appendChild(overlay);

    // Thử tự phát video
    video.play().catch(() => {
        // Nếu trình duyệt chặn tự phát,
        // người dùng có thể nhấn nút Play.
        video.controls = true;
    });
}

// ============================================================
// CHUẨN HÓA PHƯƠNG TRÌNH
// Đưa về dạng A*x + B*y = C
// ============================================================

function parseEquation(a, b, c, op) {
    let A;
    let B;
    let C;

    switch (op) {
        case '+':
            A = a;
            B = b;
            C = c;
            break;

        case '-':
            A = a;
            B = -b;
            C = c;
            break;

        case '*':
            A = a * b;
            B = 0;
            C = c;
            break;

        case '/':
            if (b === 0) {
                throw new Error('Không thể chia cho 0 (b = 0).');
            }

            A = a / b;
            B = 0;
            C = c;
            break;

        default:
            throw new Error('Phép toán không hợp lệ.');
    }

    return { A, B, C };
}

// ============================================================
// GIẢI HỆ PHƯƠNG TRÌNH
// ============================================================

function solveSystem() {
    // Lấy giá trị đầu vào
    const a1 = parseFloat(a1Input.value);
    const b1 = parseFloat(b1Input.value);
    const c1 = parseFloat(c1Input.value);

    const a2 = parseFloat(a2Input.value);
    const b2 = parseFloat(b2Input.value);
    const c2 = parseFloat(c2Input.value);

    const op1 = op1Select.value;
    const op2 = op2Select.value;

    // Kiểm tra các ô nhập
    const inputs = [
        a1Input, b1Input, c1Input,
        a2Input, b2Input, c2Input
    ];

    if (inputs.some(input => input.value.trim() === '')) {
        showResult(
            '⚠️ Vui lòng nhập đầy đủ các hệ số của hệ phương trình.',
            'error'
        );

        return;
    }

    // Kiểm tra số hợp lệ
    const values = [a1, b1, c1, a2, b2, c2];

    if (!values.every(Number.isFinite)) {
        showResult(
            '⚠️ Các hệ số phải là những số hợp lệ.',
            'error'
        );

        return;
    }

    // ========================================================
    // KIỂM TRA MÃ BÍ MẬT
    // ========================================================

    const isSecret = checkEasterEgg(
        a1, b1, c1, op1,
        a2, b2, c2, op2
    );

    if (isSecret) {
        playSecretVideo();
    }

    // ========================================================
    // GIẢI HỆ
    // ========================================================

    try {
        const { A: A1, B: B1, C: C1 } =
            parseEquation(a1, b1, c1, op1);

        const { A: A2, B: B2, C: C2 } =
            parseEquation(a2, b2, c2, op2);

        // Tạo các bước giải
        let step = '';

        step += 'Hệ đã chuẩn hóa:\n';

        step +=
            `  (1) ${formatNumber(A1)}x + ${formatNumber(B1)}y = ${formatNumber(C1)}\n`;

        step +=
            `  (2) ${formatNumber(A2)}x + ${formatNumber(B2)}y = ${formatNumber(C2)}\n\n`;

        // Định thức Cramer
        const D = A1 * B2 - A2 * B1;
        const Dx = C1 * B2 - C2 * B1;
        const Dy = A1 * C2 - A2 * C1;

        step +=
            `D  = A₁·B₂ − A₂·B₁ = ${formatNumber(D)}\n`;

        step +=
            `Dx = C₁·B₂ − C₂·B₁ = ${formatNumber(Dx)}\n`;

        step +=
            `Dy = A₁·C₂ − A₂·C₁ = ${formatNumber(Dy)}\n\n`;

        let html = '';

        // ====================================================
        // HỆ CÓ NGHIỆM DUY NHẤT
        // ====================================================

        if (D !== 0) {
            const x = Dx / D;
            const y = Dy / D;

            html += '✅ <strong>Hệ có nghiệm duy nhất</strong>\n\n';

            html += `<div class="step-box">${step}</div>`;

            html +=
                `📌 <span class="highlight">x = ${formatNumber(x)}</span>\n`;

            html +=
                `📌 <span class="highlight">y = ${formatNumber(y)}</span>`;

            showResult(html, 'success');
        }

        // ====================================================
        // HỆ CÓ VÔ SỐ NGHIỆM
        // ====================================================

        else if (Dx === 0 && Dy === 0) {
            html += 'ℹ️ <strong>Hệ có vô số nghiệm</strong>\n\n';

            html += `<div class="step-box">${step}</div>`;

            html += '→ D = Dx = Dy = 0 → hệ vô số nghiệm.';

            showResult(html, 'info');
        }

        // ====================================================
        // HỆ VÔ NGHIỆM
        // ====================================================

        else {
            html += '❌ <strong>Hệ vô nghiệm</strong>\n\n';

            html += `<div class="step-box">${step}</div>`;

            html +=
                '→ D = 0 nhưng Dx ≠ 0 hoặc Dy ≠ 0 → hệ vô nghiệm.';

            showResult(html, 'error');
        }

    } catch (err) {
        showResult('❌ Lỗi: ' + err.message, 'error');
    }
}

// ============================================================
// RESET FORM
// ============================================================

function resetForm() {
    [
        a1Input, b1Input, c1Input,
        a2Input, b2Input, c2Input
    ].forEach((el) => {
        el.value = '';
    });

    op1Select.value = '+';
    op2Select.value = '+';

    clearResult();
    updatePreview();

    a1Input.focus();
}

// ============================================================
// GẮN SỰ KIỆN CHO NÚT
// ============================================================

solveBtn.addEventListener('click', solveSystem);

resetBtn.addEventListener('click', resetForm);

// ============================================================
// CẬP NHẬT PREVIEW VÀ NHẤN ENTER ĐỂ GIẢI
// ============================================================

[
    a1Input, b1Input, c1Input,
    a2Input, b2Input, c2Input
].forEach((el) => {
    el.addEventListener('input', updatePreview);

    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            solveSystem();
        }
    });
});

// ============================================================
// CẬP NHẬT PREVIEW KHI ĐỔI PHÉP TOÁN
// ============================================================

[op1Select, op2Select].forEach((el) => {
    el.addEventListener('change', updatePreview);
});

// ============================================================
// KHỞI TẠO PREVIEW
// ============================================================

updatePreview();
