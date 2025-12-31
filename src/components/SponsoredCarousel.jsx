"use client";
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Heading from './Heading';

const SponsoredCarousel = ({ heading, images }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!images || images.length === 0) return null;

    return (
        <div className='mb-5'>
            <Heading text={heading}/>
            {mounted && (
                <SponsoredSlider
                    images={images}
                    autoplayDelay={3000}
                />
            )}
        </div>
    )
}

const SponsoredSlider = ({ images, autoplayDelay = 4000 }) => {
    const sliderRef = useRef(null);
    const timerRef = useRef(null);

    const [sliderInstanceRef, slider] = useKeenSlider({
        loop: true,
        drag: true,
        mode: "free-snap",
        slides: {
            perView: 1,
            spacing: 16,
        },
        breakpoints: {
            "(min-width: 640px)": {
                slides: {
                    perView: 1,
                    spacing: 20,
                },
            },
            "(min-width: 1024px)": {
                slides: {
                    perView: 1,
                    spacing: 24,
                },
            },
        },
        renderMode: "performance",
        defaultAnimation: {
            duration: 1000,
            easing: (t) => t,
        },
    });

    useEffect(() => {
        if (!slider.current) return;

        const start = () => {
            timerRef.current = setInterval(() => {
                if (!slider.current) return;
                slider.current.next();
            }, autoplayDelay);
        };

        const stop = () => clearInterval(timerRef.current);

        start();

        const sliderElement = sliderRef.current;
        sliderElement?.addEventListener("mouseenter", stop);
        sliderElement?.addEventListener("mouseleave", start);

        return () => {
            stop();
            sliderElement?.removeEventListener("mouseenter", stop);
            sliderElement?.removeEventListener("mouseleave", start);
        };
    }, [slider, autoplayDelay]);

    return (
        <div className="w-full rounded-3xl overflow-hidden">
            <div
                ref={(ref) => {
                    sliderRef.current = ref;
                    sliderInstanceRef(ref);
                }}
                className="keen-slider"
            >
                {images.map((item, index) => (
                    <div
                        key={index}
                        className="keen-slider__slide  w-full"
                    >
                        <Link href={item.href ? item.href : '#'} aria-label={item.label} className="block">
                            <div className="relative overflow-hidden rounded-3xl group cursor-pointer">
                                <Image
                                    src={item.url}
                                    alt={item.label}
                                    width={400}
                                    height={250}
                                    className="object-cover w-full h-[250px] transition-transform duration-300 group-hover:scale-105"
                                    placeholder="blur"
                                    blurDataURL="/placeholder.webp"
                                />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SponsoredCarousel;