import React, { useEffect, useState, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "lg";
  dontShowClose?: boolean;
}> = ({ isOpen, onClose, children, size, dontShowClose }) => {
  const [modalOpen, setModalOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setModalOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] flex justify-center items-end md:items-center backdrop-blur-md transition-opacity ${
          modalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`drop-shadow-black bg-white rounded-lg p-4 md:p-6 w-[95%] ${
            size === "lg" ? "md:w-3/5" : "md:w-[28rem]"
          } transform transition-transform duration-500 ease-in-out ${
            modalOpen
              ? "translate-y-0 md:scale-100"
              : "translate-y-full md:translate-y-0  md:scale-0"
          }`}
        >
          {!dontShowClose && (
            <button
              onClick={handleClose}
              className="absolute top-6 right-6  text-lg"
            >
              <FaTimes />
            </button>
          )}
          {modalOpen && children}
        </div>
      </div>
    </>
  );
};

export default Modal;
