
// ============================================================
// GIẢI HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
// ============================================================

// ============================================================
// 1. LẤY CÁC PHẦN TỬ DOM
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
// 2. HÀM TIỆN ÍCH
// ============================================================

/**
 * Chuyển ký hiệu phép toán thành ký hiệu hiển thị.
 */
function opSymbol(op) {
    return {
        '+': '+',
        '-': '−',
        '*': '×',
        '/': '÷'
    }[op] || op;
}

/**
 * Định dạng số với tối đa 6 chữ số thập phân.
 */
function formatNumber(n) {
    if (!Number.isFinite(n)) return '∞';

    const rounded = Math.round(n * 1e6) / 1e6;
    return rounded.toString();
}

/**
 * Cập nhật hệ phương trình xem trước.
 */
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

/**
 * Hiển thị kết quả giải.
 */
function showResult(html, type = 'info') {
    resultBox.className = 'result show ' + type;
    resultBox.innerHTML = html;
}

/**
 * Xóa kết quả.
 */
function clearResult() {
    resultBox.className = 'result';
    resultBox.innerHTML = '';
}

// ============================================================
// 3. EASTER EGG — VIDEO GITHUB
// ============================================================

const SECRET_A = 18;
const SECRET_B = 12;
const SECRET_C = 2012;

// Video được nhúng trực tiếp bằng CDN jsDelivr.
const SECRET_VIDEO =
    'https://cdn.jsdelivr.net/gh/quanglong100512-lang/hoangthai@main/hoangthai.mp4';

/**
 * Kiểm tra mã bí mật.
 * Nếu đúng, hiển thị trình phát video ngay trong trang.
 */
function checkEasterEgg(a1, b1, c1) {
    if (
        a1 === SECRET_A &&
        b1 === SECRET_B &&
        c1 === SECRET_C
    ) {
        return `
            <div class="easter-egg">

                <div class="egg-title">
                    🎉 Chúc mừng! Bạn đã tìm ra mã bí mật!
                </div>

                <div class="egg-video-container">

                    <video
                        class="egg-video"
                        controls
                        playsinline
                        preload="metadata"
                        style="
                            display: block;
                            width: 100%;
                            max-width: 600px;
                            margin: 15px auto;
                            border-radius: 12px;
                            background: #000;
                        "
                    >
                        <source
                            src="${SECRET_VIDEO}"
                            type="video/mp4"
                        >

                        Trình duyệt của bạn không hỗ trợ phát video.
                    </video>

                </div>

            </div>
        `;
    }

    return '';
}

// ============================================================
// 4. CHUẨN HÓA PHƯƠNG TRÌNH
// ============================================================

/**
 * Chuyển phương trình dạng a*x [op] b*y = c
 * về dạng A*x + B*y = C.
 *
 * '+': A = a,   B = b,  C = c
 * '-': A = a,   B = -b, C = c
 * '*': A = a*b, B = 0,  C = c
 * '/': A = a/b, B = 0,  C = c
 */
function parseEquation(a, b, c, op) {
    let A, B, C;

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
// 5. ĐỌC VÀ KIỂM TRA DỮ LIỆU
// ============================================================

/**
 * Đọc một hệ số từ ô nhập.
 * Nếu ô trống thì xem là 0.
 */
function readNumber(input) {
    if (input.value.trim() === '') return 0;

    const value = Number(input.value);

    if (!Number.isFinite(value)) {
        throw new Error('Vui lòng nhập hệ số hợp lệ.');
    }

    return value;
}

/**
 * Kiểm tra người dùng đã nhập ít nhất một hệ số.
 */
function isFormEmpty() {
    return [
        a1Input,
        b1Input,
        c1Input,
        a2Input,
        b2Input,
        c2Input
    ].every(input => input.value.trim() === '');
}

// ============================================================
// 6. GIẢI HỆ PHƯƠNG TRÌNH
// ============================================================

function solveSystem() {

    // Kiểm tra form rỗng.
    if (isFormEmpty()) {
        showResult(
            '⚠️ Vui lòng nhập các hệ số của hệ phương trình.',
            'error'
        );
        return;
    }

    try {
        // Đọc hệ số.
        const a1 = readNumber(a1Input);
        const b1 = readNumber(b1Input);
        const c1 = readNumber(c1Input);

        const a2 = readNumber(a2Input);
        const b2 = readNumber(b2Input);
        const c2 = readNumber(c2Input);

        const op1 = op1Select.value;
        const op2 = op2Select.value;

        // Chuẩn hóa hai phương trình.
        const { A: A1, B: B1, C: C1 } =
            parseEquation(a1, b1, c1, op1);

        const { A: A2, B: B2, C: C2 } =
            parseEquation(a2, b2, c2, op2);

        // Tính định thức Cramer.
        const D = A1 * B2 - A2 * B1;
        const Dx = C1 * B2 - C2 * B1;
        const Dy = A1 * C2 - A2 * C1;

        // Chuẩn bị các bước giải.
        let step = '';

        step += 'Hệ đã chuẩn hóa:\n';

        step +=
            `(1) ${formatNumber(A1)}x + ` +
            `${formatNumber(B1)}y = ${formatNumber(C1)}\n`;

        step +=
            `(2) ${formatNumber(A2)}x + ` +
            `${formatNumber(B2)}y = ${formatNumber(C2)}\n\n`;

        step +=
            `D = A₁·B₂ − A₂·B₁ = ${formatNumber(D)}\n`;

        step +=
            `Dx = C₁·B₂ − C₂·B₁ = ${formatNumber(Dx)}\n`;

        step +=
            `Dy = A₁·C₂ − A₂·C₁ = ${formatNumber(Dy)}\n\n`;

        // Kiểm tra mã bí mật dựa trên ba hệ số đầu tiên.
        const egg = checkEasterEgg(a1, b1, c1);

        let html = '';

        // ----------------------------------------------------
        // Trường hợp 1: Hệ có nghiệm duy nhất.
        // ----------------------------------------------------

        if (D !== 0) {
            const x = Dx / D;
            const y = Dy / D;

            html +=
                '✅ <strong>Hệ có nghiệm duy nhất</strong>\n\n';

            html += `<div class="step-box">${step}</div>`;

            html +=
                `📌 <span class="highlight">x = ${formatNumber(x)}</span>\n`;

            html +=
                `📌 <span class="highlight">y = ${formatNumber(y)}</span>`;

            html += egg;

            showResult(html, 'success');
        }

        // ----------------------------------------------------
        // Trường hợp 2: Hệ có vô số nghiệm.
        // ----------------------------------------------------

        else if (Dx === 0 && Dy === 0) {
            html +=
                'ℹ️ <strong>Hệ có vô số nghiệm</strong>\n\n';

            html += `<div class="step-box">${step}</div>`;

            html +=
                '→ D = Dx = Dy = 0 → hệ vô số nghiệm.';

            html += egg;

            showResult(html, 'info');
        }

        // ----------------------------------------------------
        // Trường hợp 3: Hệ vô nghiệm.
        // ----------------------------------------------------

        else {
            html +=
                '❌ <strong>Hệ vô nghiệm</strong>\n\n';

            html += `<div class="step-box">${step}</div>`;

            html +=
                '→ D = 0 nhưng Dx ≠ 0 hoặc Dy ≠ 0 → hệ vô nghiệm.';

            html += egg;

            showResult(html, 'error');
        }

    } catch (err) {
        showResult(
            '❌ Lỗi: ' + err.message,
            'error'
        );
    }
}

// ============================================================
// 7. RESET FORM
// ============================================================

function resetForm() {

    [
        a1Input,
        b1Input,
        c1Input,
        a2Input,
        b2Input,
        c2Input
    ].forEach(input => {
        input.value = '';
    });

    op1Select.value = '+';
    op2Select.value = '+';

    clearResult();
    updatePreview();

    a1Input.focus();
}

// ============================================================
// 8. GẮN SỰ KIỆN
// ============================================================

// Nút giải hệ.
solveBtn.addEventListener('click', solveSystem);

// Nút xóa.
resetBtn.addEventListener('click', resetForm);

// Cập nhật preview khi nhập hệ số.
// Nhấn Enter để giải hệ.
[
    a1Input,
    b1Input,
    c1Input,
    a2Input,
    b2Input,
    c2Input
].forEach(input => {

    input.addEventListener('input', updatePreview);

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            solveSystem();
        }
    });
});

// Cập nhật preview khi thay đổi phép toán.
[op1Select, op2Select].forEach(select => {
    select.addEventListener('change', updatePreview);
});

// ============================================================
// 9. KHỞI TẠO
// ============================================================

updatePreview();
