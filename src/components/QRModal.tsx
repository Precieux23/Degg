"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRModal() {
  const [isOpen, setIsOpen] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
      >
        📱 QR Code
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">DÉGG</h2>
            <p className="text-xs text-gray-400 mb-6">
              Scannez pour accéder à l&apos;app
            </p>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <QRCodeSVG
                  value={url || "https://degg-joj.vercel.app"}
                  size={180}
                  fgColor="#16a34a"
                  level="H"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Partagez avec volontaires et visiteurs JOJ
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-2xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}