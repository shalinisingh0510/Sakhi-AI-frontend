import { useState, useRef, useCallback } from "react";

export type RecordingState = 
  | "IDLE" 
  | "REQUESTING_PERMISSION" 
  | "RECORDING" 
  | "PROCESSING" 
  | "ERROR";

interface UseAudioRecorderOptions {
  maxDurationSeconds?: number;
  onRecordingComplete: (audioBlob: Blob) => void;
  onError: (error: string) => void;
}

export function useAudioRecorder({ maxDurationSeconds = 60, onRecordingComplete, onError }: UseAudioRecorderOptions) {
  const [state, setState] = useState<RecordingState>("IDLE");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setState("REQUESTING_PERMISSION");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        
        // Cleanup tracks
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorder.start();
      setState("RECORDING");

      if (maxDurationSeconds > 0) {
        timerRef.current = setTimeout(() => {
          stopRecording();
        }, maxDurationSeconds * 1000);
      }
    } catch (err) {
      console.error("Microphone access denied or error", err);
      setState("ERROR");
      onError("Microphone access denied or unsupported browser.");
    }
  }, [maxDurationSeconds, onRecordingComplete, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      setState("PROCESSING");
      mediaRecorderRef.current.stop();
    }
  }, []);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      // Just stop tracks, don't trigger onstop complete processing
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current.stop();
    }
    setState("IDLE");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    state,
    setState,
    startRecording,
    stopRecording,
    cancelRecording
  };
}

