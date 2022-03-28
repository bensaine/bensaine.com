import * as React from 'react'
import * as SolidIcons from '@heroicons/react/solid';
import * as OutlineIcons from '@heroicons/react/outline';
import internal from 'stream';

interface Props {
    name: string;
    size: number;
    solid?: boolean;
}

const Icon = ({ name, size, solid } : Props) => {
    const { ...icons } = solid ? SolidIcons : OutlineIcons;
    // @ts-ignore
    const HeroIcon: JSX.Element = icons[name+"Icon"];
    
    return (
        // @ts-ignore
        <HeroIcon className={`h-${size} w-${size} text-white`} aria-hidden="true" />
    )
}

export default Icon