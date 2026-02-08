import React, { useState } from "react";
import { getTextureUrl } from "../../data/materials";
import { cn } from "../../utils/cn";

/**
 * IsometricBlock - Renders a Minecraft block as a 3D isometric cube
 * Uses CSS transforms to create a 3D effect with the block texture
 */
const IsometricBlock = ({ material, size = 32, className }) => {
    const [hasError, setHasError] = useState(false);
    const textureUrl = getTextureUrl(material);

    // Calculate face sizes for isometric projection
    const faceSize = size * 0.7;
    const topOffset = size * 0.15;

    if (!material || hasError || !textureUrl) {
        return (
            <div
                className={cn("flex items-center justify-center bg-surface/50 rounded", className)}
                style={{ width: size, height: size }}
            >
                <span className="text-[8px] text-textMuted uppercase font-bold">
                    {material?.slice(0, 2) || "?"}
                </span>
            </div>
        );
    }

    return (
        <div
            className={cn("relative", className)}
            style={{
                width: size,
                height: size,
                transformStyle: "preserve-3d",
            }}
        >
            {/* Isometric cube container */}
            <div
                className="absolute inset-0"
                style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(60deg) rotateZ(-45deg)",
                    transformOrigin: "center center",
                }}
            >
                {/* Top face */}
                <div
                    className="absolute"
                    style={{
                        width: faceSize,
                        height: faceSize,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) translateZ(${faceSize / 2}px)`,
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: "cover",
                        imageRendering: "pixelated",
                        filter: "brightness(1.1)",
                    }}
                />

                {/* Front face */}
                <div
                    className="absolute"
                    style={{
                        width: faceSize,
                        height: faceSize,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${faceSize / 2}px)`,
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: "cover",
                        imageRendering: "pixelated",
                        filter: "brightness(0.8)",
                    }}
                />

                {/* Right face */}
                <div
                    className="absolute"
                    style={{
                        width: faceSize,
                        height: faceSize,
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${faceSize / 2}px)`,
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: "cover",
                        imageRendering: "pixelated",
                        filter: "brightness(0.6)",
                    }}
                />
            </div>

            {/* Hidden image for error detection */}
            <img
                src={textureUrl}
                alt=""
                className="hidden"
                onError={() => setHasError(true)}
            />
        </div>
    );
};

export default IsometricBlock;
