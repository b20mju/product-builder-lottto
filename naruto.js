const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let model;
let handpose;

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadHandpose() {
    model = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
        runtime: 'tfjs'
    });
    console.log("Handpose model loaded.");
}

async function detectHands() {
    const hands = await model.estimateHands(video, {
        flipHorizontal: false
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (hands.length > 0) {
        hands.forEach(hand => {
            if (isPalmUp(hand)) {
                drawRasengan(hand);
            }
        });
    }

    requestAnimationFrame(detectHands);
}

function isPalmUp(hand) {
    const wrist = hand.keypoints[0];
    const palm = hand.keypoints[9];

    return palm.y < wrist.y;
}

function drawRasengan(hand) {
    const palm = hand.keypoints[9];
    const x = palm.x;
    const y = palm.y;

    // Simple Rasengan animation
    const radius = 50;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 150, 255, 0.7)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
}


async function main() {
    await setupCamera();
    video.play();

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    await loadHandpose();
    detectHands();
}

main();