"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageBlob: Blob, filename: string) => void;
  onCancel: () => void;
}

export default function ImageEditor({ imageUrl, onSave, onCancel }: ImageEditorProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSave = useCallback(async () => {
    const image = imgRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    if (completedCrop) {
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
    } else {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    }

    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    if (completedCrop) {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      ctx.drawImage(image, 0, 0);
    }

    ctx.restore();

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const filename = `edited-${Date.now()}.jpg`;
        onSave(blob, filename);
      }
    }, "image/jpeg", 0.95);
  }, [completedCrop, rotation, scale, onSave]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bebas text-navy">Edit Image</h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Controls */}
          <div className="mb-4 space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="font-montserrat font-semibold text-navy min-w-[100px]">
                Rotation:
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1"
              />
              <span className="font-lato text-gray-600 min-w-[60px]">{rotation}°</span>
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-1 bg-navy text-white rounded hover:bg-navy/90 text-sm"
              >
                90°
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="font-montserrat font-semibold text-navy min-w-[100px]">
                Scale:
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="flex-1"
              />
              <span className="font-lato text-gray-600 min-w-[60px]">{scale.toFixed(1)}x</span>
              <button
                onClick={() => setScale(1)}
                className="px-3 py-1 bg-navy text-white rounded hover:bg-navy/90 text-sm"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center gap-4">
              <label className="font-montserrat font-semibold text-navy min-w-[100px]">
                Crop:
              </label>
              <span className="font-lato text-gray-600 text-sm">
                {completedCrop
                  ? `${Math.round(completedCrop.width)} × ${Math.round(completedCrop.height)}px`
                  : "Select area to crop"}
              </span>
              {completedCrop && (
                <button
                  onClick={() => {
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Clear Crop
                </button>
              )}
            </div>
          </div>

          {/* Image Editor */}
          <div className="mb-4 flex justify-center bg-gray-100 rounded-lg p-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Edit"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  maxWidth: "100%",
                  maxHeight: "60vh",
                }}
              />
            </ReactCrop>
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-montserrat font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 font-montserrat font-semibold"
            >
              💾 Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
