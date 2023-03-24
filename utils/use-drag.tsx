import { useState, useEffect, useRef } from 'react';

const getElementTransformXY = (element) => {
    const transform = window.getComputedStyle(element).getPropertyValue("transform");
    if (transform === "none") return { translateX: 0, translateY: 0 };
    const matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(parseFloat);
    const translateX = matrix[4];
    const translateY = matrix[5];
    return { translateX, translateY };
};


const useDrag = () => {

    const [isDragging, setIsDragging] = useState(false);
    const domRef = useRef<HTMLDivElement>();


    const handleDrag = (e) => {
        const { translateX, translateY } = getElementTransformXY(domRef.current);
        const mx = e.movementX;
        const my = e.movementY;
        domRef.current.style.transform = `translateX(${mx + translateX}px) translateY(${my + translateY}px)`;
    };

    const handlePointerDown = (e) => {
        setIsDragging(true);
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
    };

    const handlePointerMove = (e) => {
        if (isDragging) {
            handleDrag(e);
        }
    };

    useEffect(() => {
        const element = domRef.current;
        if (element) {
            element.addEventListener('pointerdown', handlePointerDown);
            element.addEventListener('pointerup', handlePointerUp);
            element.addEventListener('pointermove', handlePointerMove);
            document.body.addEventListener('pointermove', handlePointerMove);

            return () => {
                element.removeEventListener('pointerdown', handlePointerDown);
                element.removeEventListener('pointerup', handlePointerUp);
                element.removeEventListener('pointermove', handlePointerMove);
                document.body.removeEventListener('pointermove', handlePointerMove);
            };
        }

        return () => { };
    }, [isDragging]);

    return { isDragging, domRef };
};

export default useDrag;