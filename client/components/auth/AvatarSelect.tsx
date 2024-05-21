import React, { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import Image from 'next/image'
import { type CarouselApi } from "@/components/ui/carousel"

type Props = {
    onSelect?: (avatarName: string) => void
}

const avatarBasePath = "/avatars/avatar";
const avatarCount = 15;

export const AvatarSelect = ({
    onSelect = (avatarName: string) => ''
}: Props) => {

    const avatars = Array.from({ length: avatarCount }, (_, i) => `${avatarBasePath}${i + 1}.png`);

    // const onSelectAvatar = (avatarName: string) => {
    //     console.log("Avatar selected: ", avatarName);
    //     onSelect(avatarName)
    // }

    const [api, setApi] = React.useState<CarouselApi>()
    React.useEffect(() => {
        if (!api) {
            return
        }

        console.log("Carousel API set")
        api.on("slidesInView", () => {
            const selectedSlideIndex = api.slidesInView()[0];
            const selectedAvatar = avatars[selectedSlideIndex];
            onSelect(selectedAvatar);
    
            console.log("Selected slidess: ", selectedAvatar)
        })
    }, [api,avatars,onSelect])

    return (
        <div className='w-[60px] '>
            <Carousel setApi={setApi}>
                <CarouselContent>
                    {avatars.map((avatar, index) => (
                        <CarouselItem key={index} className="flex cursor-pointer justify-center">
                            <Image
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                width={60}
                                height={60}
                                className="rounded-full border-2 border-gray-300 hover:border-blue-500" />
                        </CarouselItem>
                    ))}

                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>


    );
};

