
"use strict";

// Địa chỉ video cho hai lựa chọn
const VIDEO_HUMA =
    "https://quanglong100512-lang.github.io/hoangthai/huma.mp4";

const VIDEO_HOANGTHAI =
    "https://quanglong100512-lang.github.io/hoangthai/hoangthai.mp4";

// Lấy phần tử HTML
const ids = [
    "a1", "b1", "c1", "op1",
    "a2", "b2", "c2", "op2"
];

const fields = Object.fromEntries(
    ids.map(id => [id, document.getElementById(id)])
);

const preview1 = document.getElementById("preview1");
const preview2 = document.getElementById("preview2");
const solveBtn = document.getElementById("solveBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");

function getNumber(id) {
    const value = fields[id].value.trim();

    if (value === "") {
        return null;
    }

    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function formatNumber(number) {
    if (Math.abs(number) < 1e-10) {
        return "0";
    }

    return Number(number.toFixed(6)).toString();
}

function formatTerm(coefficient, variable, isFirst = false) {
    const sign = coefficient < 0 ? "−" : "+";
    const absolute = Math.abs(coefficient);

    let value = "";

    if (absolute !== 1) {
        value = formatNumber(absolute);
    }

    value += variable;

    if (isFirst) {
        return coefficient < 0 ? "−" + value : value;
    }

    return ` ${sign} ${value}`;
}

function makeEquation(a, b, c) {
    const first = formatTerm(a, "x", true);
    const second = formatTerm(b, "y");
    return `${first}${second} = ${formatNumber(c)}`;
}

function updatePreview() {
    const a1 = getNumber("a1");
    const b1 = getNumber("b1");
    const c1 = getNumber("c1");
    const a2 = getNumber("a2");
    const b2 = getNumber("b2");
    const c2 = getNumber("c2");

    if (a1 !== null && b1 !== null && c1 !== null) {
        const signedB1 = fields.op1.value === "-" ? -b1 : b1;
        preview1.textContent = makeEquation(a1, signedB1, c1);
    } else {
        preview1.textContent = "Nhập đủ hệ số phương trình 1";
    }

    if (a2 !== null && b2 !== null && c2 !== null) {
        const signedB2 = fields.op2.value === "-" ? -b2 : b2;
        preview2.textContent = makeEquation(a2, signedB2, c2);
    } else {
        preview2.textContent = "Nhập đủ hệ số phương trình 2";
    }
}

function getSystem() {
    const a1 = getNumber("a1");
    const b1 = getNumber("b1");
    const c1 = getNumber("c1");
    const a2 = getNumber("a2");
    const b2 = getNumber("b2");
    const c2 = getNumber("c2");

    if ([a1, b1, c1, a2, b2, c2].some(value => value === null)) {
        return null;
    }

    return {
        a1,
        b1: fields.op1.value === "-" ? -b1 : b1,
        c1,
        a2,
        b2: fields.op2.value === "-" ? -b2 : b2,
        c2
    };
}

// Kiểm tra hệ đặc biệt để bật câu hỏi
function isSecretSystem(system) {
    const epsilon = 1e-9;

    const same = (a, b) => Math.abs(a - b) < epsilon;

    return (
        same(system.a1, 18) &&
        same(system.b1, 12) &&
        same(system.c1, 2012) &&
        same(system.a2, 1) &&
        same(system.b2, 1) &&
        same(system.c2, 5)
    );
}

function showSecretQuestion() {
    // Không tạo nhiều hộp câu hỏi cùng lúc
    if (document.querySelector(".secret-overlay")) {
        return;
    }

    const overlay = document.createElement("div");
    overlay.className = "secret-overlay";

    const dialog = document.createElement("div");
    dialog.className = "secret-dialog";

    const heading = document.createElement("h2");
    heading.textContent = "Bạn có sợ không?";

    const description = document.createElement("p");
    description.textContent = "Chọn một câu trả lời nhé.";

    const buttons = document.createElement("div");
    buttons.className = "secret-buttons";

    const yesButton = document.createElement("button");
    yesButton.className = "yes-btn";
    yesButton.textContent = "Có";

    const noButton = document.createElement("button");
    noButton.className = "no-btn";
    noButton.textContent = "Không";

    yesButton.addEventListener("click", () => {
        overlay.remove();
        openSecretVideo(VIDEO_HUMA);
    });

    noButton.addEventListener("click", () => {
        overlay.remove();
        openSecretVideo(VIDEO_HOANGTHAI);
    });

    buttons.append(yesButton, noButton);
    dialog.append(heading, description, buttons);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

function openSecretVideo(videoUrl) {
    const screen = document.createElement("div");
    screen.className = "secret-video-screen";

    const video = document.createElement("video");
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";

    const message = document.createElement("p");
    message.className = "video-message";
    message.textContent = "Đang mở video…";

    const closeButton = document.createElement("button");
    closeButton.className = "video-close";
    closeButton.textContent = "Đóng video";

    closeButton.addEventListener("click", () => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        screen.remove();
    });

    video.addEventListener("playing", () => {
        message.textContent = "";
    });

    video.addEventListener("error", () => {
        message.textContent =
            "Không tải được video. Kiểm tra đường dẫn hoặc trạng thái xuất bản GitHub Pages.";
    });

    screen.append(video, message, closeButton);
    document.body.appendChild(screen);

    // Thử phát ngay sau cú bấm Có/Không.
    // Nếu trình duyệt chặn phát có tiếng, thử phát ở chế độ tắt tiếng.
    const playAttempt = video.play();

    if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {
            video.muted = true;

            video.play().catch(() => {
                message.textContent =
                    "Trình duyệt chưa cho phép tự phát. Hãy bấm nút phát trên video.";
            });
        });
    }
}

function solveSystem(system) {
    const { a1, b1, c1, a2, b2, c2 } = system;

    const determinant = a1 * b2 - a2 * b1;
    const determinantX = c1 * b2 - c2 * b1;
    const determinantY = a1 * c2 - a2 * c1;

    const epsilon = 1e-10;

    if (Math.abs(determinant) > epsilon) {
        const x = determinantX / determinant;
        const y = determinantY / determinant;

        result.className = "result success";
        result.innerHTML =
            `<strong>Hệ có nghiệm duy nhất:</strong><br>` +
            `x = ${formatNumber(x)}<br>` +
            `y = ${formatNumber(y)}`;

        return;
    }

    if (
        Math.abs(determinantX) < epsilon &&
        Math.abs(determinantY) < epsilon
    ) {
        result.className = "result success";
        result.textContent =
            "Hệ có vô số nghiệm.";
    } else {
        result.className = "result error";
        result.textContent =
            "Hệ vô nghiệm.";
    }
}

function handleSolve() {
    const system = getSystem();

    if (!system) {
        result.className = "result error";
        result.textContent = "Mày hãy nhập đầy đủ các hệ số hợp lệ trước đã.";
        return;
    }

    if (isSecretSystem(system)) {
        showSecretQuestion();
    }

    solveSystem(system);
}

function resetForm() {
    ids.forEach(id => {
        if (id.startsWith("op")) {
            fields[id].value = "+";
        } else {
            fields[id].value = "";
        }
    });

    result.className = "result";
    result.textContent = "Kết quả sẽ hiển thị ở đây.";

    updatePreview();
}

ids.forEach(id => {
    fields[id].addEventListener("input", updatePreview);
    fields[id].addEventListener("change", updatePreview);
});

solveBtn.addEventListener("click", handleSolve);
resetBtn.addEventListener("click", resetForm);

// Khởi tạo giao diện
updatePreview();
