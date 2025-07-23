import Image from "next/image";
import React from "react";

type TrustProps = {};

const Trust: React.FC<TrustProps> = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center mt-[30px]">
      <div className="flex">
        <Image
          src="/img/trust/tp1.jpg"
          alt=""
          height={50}
          width={50}
          className="h-[50px] w-[50px] rounded-full object-cover border-4 border-white dark:border-[#121212]"
        />
        <Image
          src="/img/trust/tp2.jpg"
          alt=""
          height={50}
          width={50}
          className="h-[50px] w-[50px] rounded-full object-cover border-4 border-white dark:border-[#121212] -translate-x-4"
        />
        <Image
          src="/img/trust/tp3.jpg"
          alt=""
          height={50}
          width={50}
          className="h-[50px] w-[50px] rounded-full object-cover border-4 border-white dark:border-[#121212] -translate-x-8"
        />
        <Image
          src="/img/trust/tp4.jpg"
          alt=""
          height={50}
          width={50}
          className="h-[50px] w-[50px] rounded-full object-cover border-4 border-white dark:border-[#121212] -translate-x-12"
        />
        <Image
          src="/img/trust/tp5.jpg"
          alt=""
          height={50}
          width={50}
          className="h-[50px] w-[50px] rounded-full object-cover border-4 border-white dark:border-[#121212] -translate-x-16"
        />
      </div>

      <h3 className="font-semibold text-gray-600 dark:text-gray-400 mt-2 md:mt-0 md:-translate-x-14">
        <b>100+</b> businesses were price smarter
      </h3>
    </div>
  );
};
export default Trust;
