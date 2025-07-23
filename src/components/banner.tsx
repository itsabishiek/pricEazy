import { env } from "@/data/env/client";
import React from "react";

type BannerProps = {
  canRemoveBranding: boolean;
  message: string;
  mappings: {
    coupon: string;
    discount: string;
    country: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    borderRadius: string;
    isSticky: boolean;
    classPrefix?: string | null;
  };
};

const Banner: React.FC<BannerProps> = ({
  canRemoveBranding,
  customization,
  mappings,
  message,
}) => {
  const prefix = customization.classPrefix ?? "";
  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => {
      return mappedMessage.replace(new RegExp(`{${key}}`, "g"), value);
    },
    message.replace(/'/g, "&#39;")
  );

  return (
    <>
      <style type="text/css">
        {`
          .${prefix}pricEazy-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: .5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customization.isSticky ? "position: sticky;" : ""}
            border-radius: ${customization.borderRadius};
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}pricEazy-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
          }
        `}
      </style>

      <div className={`${prefix}pricEazy-container ${prefix}pricEazy-override`}>
        <span
          className={`${prefix}pricEazy-message ${prefix}pricEazy-override`}
          dangerouslySetInnerHTML={{
            __html: mappedMessage,
          }}
        />
        {!canRemoveBranding && (
          <a
            className={`${prefix}pricEazy-branding`}
            href={`${env.NEXT_PUBLIC_SERVER_URL}`}
          >
            Powered by PricEazy
          </a>
        )}
      </div>
    </>
  );
};
export default Banner;
