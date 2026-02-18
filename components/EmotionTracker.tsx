"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

interface EmotionData {
    confidence: number; // 0-1 based on smile/neutral
    eyeContact: number; // 0-1 based on gaze direction
    timestamp: number;
}

interface EmotionTrackerProps {
    onData: (data: EmotionData) => void;
    isActive: boolean;
}

const EmotionTracker = ({ onData, isActive }: EmotionTrackerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastVideoTimeRef = useRef(-1);
    const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
        null,
    );

    useEffect(() => {
        const initMediaPipe = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
            );
            const landmarker = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "GPU",
                },
                runningMode: "VIDEO",
                numFaces: 1,
            });
            setFaceLandmarker(landmarker);
        };

        initMediaPipe();
    }, []);

    useEffect(() => {
        if (!isActive || !faceLandmarker) return;

        let animationFrameId: number;

        const startCamera = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 640, height: 480 },
                    });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;

                        // Wait for metadata and a short buffer before starting prediction
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current?.play();
                            // Grace period: Wait 1 second for the hardware/WASM delegate to stabilize
                            setTimeout(() => {
                                requestAnimationFrame(predictWebcam);
                            }, 1000);
                        };
                    }
                } catch (error) {
                    console.error("Camera access error:", error);
                }
            }
        };

        const predictWebcam = async () => {
            if (!isActive || !faceLandmarker) return;

            if (
                videoRef.current &&
                videoRef.current.readyState >= 4 && // HAVE_ENOUGH_DATA
                videoRef.current.videoWidth > 100 && // Stricter dimension check
                videoRef.current.videoHeight > 100 &&
                videoRef.current.currentTime > 0 &&
                videoRef.current.currentTime !== lastVideoTimeRef.current
            ) {
                // Temporarily mute console.error during detection to suppress
                // MediaPipe WASM-level logging that triggers the Next.js dev overlay.
                const originalConsoleError = console.error;
                console.error = (...args: any[]) => {
                    const msg = args.join(" ");
                    if (
                        msg.includes("ROI width") ||
                        msg.includes("image_to_tensor") ||
                        msg.includes("calculator_graph") ||
                        msg.includes("CalculatorGraph::Run")
                    ) {
                        return; // Suppress known MediaPipe WASM noise
                    }
                    originalConsoleError.apply(console, args);
                };

                try {
                    lastVideoTimeRef.current = videoRef.current.currentTime;
                    const results = faceLandmarker.detectForVideo(
                        videoRef.current,
                        Math.round(videoRef.current.currentTime * 1000),
                    );

                    if (
                        results.faceLandmarks &&
                        results.faceLandmarks.length > 0
                    ) {
                        const landmarks = results.faceLandmarks[0];

                        // --- Eye Contact (gaze direction) ---
                        const leftEyeInner = landmarks[398];
                        const leftEyeOuter = landmarks[263];
                        const leftIris = landmarks[473];

                        const eyeWidth = Math.abs(
                            leftEyeOuter.x - leftEyeInner.x,
                        );
                        const relativeIrisPos =
                            eyeWidth > 0.001
                                ? (leftIris.x - leftEyeInner.x) / eyeWidth
                                : 0.5;

                        const eyeContact = Math.max(
                            0,
                            1 - Math.abs(relativeIrisPos - 0.5) * 4,
                        );

                        // --- Multi-Signal Confidence Score ---

                        // 1) Mouth expressiveness (smile / engagement)
                        const lipLeft = landmarks[61];
                        const lipRight = landmarks[291];
                        const lipTop = landmarks[13];
                        const lipBottom = landmarks[14];
                        const upperLip = landmarks[0];
                        const lowerLip = landmarks[17];

                        const mouthWidth = Math.abs(lipRight.x - lipLeft.x);
                        const mouthOpenness = Math.abs(lipBottom.y - lipTop.y);
                        const jawOpenness = Math.abs(lowerLip.y - upperLip.y);

                        // Smile ratio: wider mouth relative to openness → more confident
                        const smileRatio =
                            mouthWidth > 0.001 ? mouthOpenness / mouthWidth : 0;
                        // Sigmoid-style mapping: naturally maps 0-0.6 ratio → 0.3-0.95 score
                        const mouthScore =
                            1 / (1 + Math.exp(-10 * (smileRatio - 0.15)));

                        // 2) Eye openness (droopy/tired = lower confidence)
                        const leftEyeTop = landmarks[159];
                        const leftEyeBottom = landmarks[145];
                        const rightEyeTop = landmarks[386];
                        const rightEyeBottom = landmarks[374];

                        const leftEyeOpen = Math.abs(
                            leftEyeTop.y - leftEyeBottom.y,
                        );
                        const rightEyeOpen = Math.abs(
                            rightEyeTop.y - rightEyeBottom.y,
                        );
                        const avgEyeOpen = (leftEyeOpen + rightEyeOpen) / 2;
                        // Normalize: typical eye opening is 0.01-0.04 in normalized coords
                        const eyeOpenScore = Math.min(
                            1,
                            Math.max(0, (avgEyeOpen - 0.005) / 0.03),
                        );

                        // 3) Head pose stability (via nose tip position)
                        const noseTip = landmarks[1];
                        const chin = landmarks[152];
                        const forehead = landmarks[10];
                        // Vertical alignment: face looking straight = higher confidence
                        const faceHeight = Math.abs(forehead.y - chin.y);
                        const noseRelativeY =
                            faceHeight > 0.001
                                ? (noseTip.y - forehead.y) / faceHeight
                                : 0.5;
                        // 0.55-0.65 is neutral upright position
                        const poseScore = 1 - Math.abs(noseRelativeY - 0.6) * 3;
                        const clampedPoseScore = Math.min(
                            1,
                            Math.max(0, poseScore),
                        );

                        // 4) Jaw tension (slight jaw opening indicates relaxed speaking)
                        const jawScore = Math.min(
                            1,
                            Math.max(0, jawOpenness / 0.06),
                        );

                        // Weighted composite
                        const rawConfidence =
                            mouthScore * 0.3 +
                            eyeOpenScore * 0.2 +
                            eyeContact * 0.2 +
                            clampedPoseScore * 0.15 +
                            jawScore * 0.15;

                        // Exponential moving average for smooth but responsive output
                        const alpha = 0.3; // smoothing factor (0.1=very smooth, 0.5=responsive)
                        const prevConfidence =
                            (window as any).__prevConfidence ?? rawConfidence;
                        const smoothedConfidence =
                            alpha * rawConfidence +
                            (1 - alpha) * prevConfidence;
                        (window as any).__prevConfidence = smoothedConfidence;

                        const confidence = Math.min(
                            1,
                            Math.max(0, smoothedConfidence),
                        );

                        onData({
                            confidence: Math.min(1, confidence),
                            eyeContact: Math.min(1, eyeContact),
                            timestamp: Date.now(),
                        });
                    }
                } catch {
                    // Silently ignore all MediaPipe detection errors
                } finally {
                    // Always restore console.error
                    console.error = originalConsoleError;
                }
            }
            animationFrameId = requestAnimationFrame(predictWebcam);
        };

        startCamera();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isActive, faceLandmarker, onData]);

    return (
        <div className="fixed inset-0 pointer-events-none opacity-0 overflow-hidden">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
            />
        </div>
    );
};

export default EmotionTracker;
