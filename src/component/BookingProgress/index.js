import { Navbar, Nav, Card, ListGroup, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";

export default function BookingProgress({ currentStep }) {
    const steps = [
        "Chọn ghế",
        "Thanh toán",
        "Hoàn tất"
    ]
    return (
        <div className="flex items-center justify-center  mb-10 text-sm font-medium">
            {[
                "Chọn ghế",
                "Thanh toán",
                "Hoàn tất"
            ].map((step, index) => {
                const stepNumber = index + 1;
                const isActive = currentStep === stepNumber;
                return (
                    <div key={stepNumber} className="flex items-center gap-2 text-gray-400">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                            {stepNumber}
                        </span>
                        {step}

                        {stepNumber < steps.length && (
                            <div className="w-16 h-[2px] bg-gray-300 mx-4"></div>
                        )}
                    </div>

                )
            })}
            {/* <div className="flex items-center gap-2 text-gray-400">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
                    1
                </span>
                Chọn ghế
            </div>

            <div className="w-16 h-[2px] bg-gray-300 mx-4"></div>

            <div className="flex items-center gap-2 text-blue-600">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
                    2
                </span>
                Thanh toán
            </div>

            <div className="w-16 h-[2px] bg-gray-300 mx-4"></div>

            <div className="flex items-center gap-2 text-gray-400">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
                    3
                </span>
                Hoàn tất
            </div> */}
        </div>
    )
}