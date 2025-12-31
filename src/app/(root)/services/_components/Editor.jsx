import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Edit, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Editor = ({
    leftBadgeText = "",
    headline = "",
    subheadline = "",
    ctaLabel = "",
    statTitle = "",
    statSubtitle = "",
    reviewSource = "",
    reviewCount = "",
    topLeftImage = "",
    bottomBgImage = "",
}) => {
    return (
        <div className='w-full h-full p-4 font-primary'>
            <section >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className='text-center text-sm py-1.5 rounded-full bg-[#f6f4f1] w-max mx-auto px-3'>
                            {leftBadgeText ? `🎉 ${leftBadgeText}` : ''}
                        </p>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black flex gap-x-2 cursor-pointer items-center shadow border-none ">
                        <Edit
                            size={17}
                            color='#000'
                        />
                        <p className='text-sm'>Edit Label</p>
                    </TooltipContent>
                </Tooltip>
            </section>
            <section className='grid grid-cols-2 gap-x-5 mt-16'>
                <section className='col-span-1'>
                    <div className='space-y-4'>
                        <p className='text-xs'>{leftBadgeText}</p>

                        <h1 className='text-5xl font-primary font-semibold'>{headline}</h1>
                        <p className='text-black/80'>{subheadline}</p>
                        <Button className="rounded-full">{ctaLabel}</Button>
                        <div className='flex items-center gap-x-1'>
                            <span className='text-gray-500 text-xs'>{reviewSource}</span>
                            <div className='flex items-center'>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} strokeWidth={0} fill='gray' size={12} />
                                ))}
                            </div>
                            <span className='text-gray-500 text-xs'>{reviewCount}</span>
                        </div>
                    </div>
                </section>
                <section className='col-span-1'>
                    <div className='grid grid-cols-2 gap-1 h-full'>
                        <div className='col-span-1 overflow-hidden rounded-lg'>
                            {topLeftImage ? (
                                <Image
                                    src={topLeftImage}
                                    width={200}
                                    height={200}
                                    alt=''
                                    className='w-full h-full object-cover'
                                />
                            ) : null}
                        </div>
                        <div className='col-span-1 p-3 rounded-lg bg-black flex flex-col items-center justify-between'>
                            <p className='text-white text-xl'>{statTitle} <span className='opacity-75'>{statSubtitle}</span></p>
                            <p className='text-gray-500 text-xs '>From customers who used Artifact for at least 12 months.</p>
                        </div>
                        <div
                            className="col-span-2 h-28 rounded-lg flex items-center justify-center relative overflow-hidden"
                            style={bottomBgImage ? {
                                backgroundImage: `url(${bottomBgImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            } : {}}
                        >
                            <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg flex items-center gap-3">
                                <p className="text-base font-medium">
                                    Summarize trends from Q1 sales data
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </div>
    )
}

export default Editor