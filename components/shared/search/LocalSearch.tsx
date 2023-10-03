'use client';

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  otherClasses: string;
  placeholder?: string;
}

const LocalSearch = ({
  route,
  iconPosition,
  imgSrc,
  otherClasses,
  placeholder,
}: CustomInputProps) => {
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search icon"
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={''}
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search icon"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
